/** @param {NS} ns */
export function scan(ns) {
    ns.disableLog("scan");
    function subscan(ns, parent, server, list) {
        const children = ns.scan(server);
        for (let child of children) {
            if (parent == child) {
                continue;
            }
            list.push(child);
            subscan(ns, server, child, list);
        }
    }
    const l = [];
    subscan(ns, '', 'home', l);
    return l;
}

export function hasTools(ns, ports) {
    const toolsList = ['BruteSSH.exe', 'FTPCrack.exe', 'RelaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
    let haveTools = 0;

    toolsList.forEach(t => {
        if (ns.fileExists(t)) {
            haveTools++;
        }
    });
    return ports <= haveTools;
}
/** @param {NS} ns */
export async function unlockAndExecute(ns, hostname, serverToHack) {
    const unlockScriptName = 'unlock.js';
    const scriptToExecute = 'autohack.js';
    const autohackMemCost = ns.getScriptRam(scriptToExecute);

    ns.tprintf("Unlocking hostanme: %s", hostname);
    ns.exec(unlockScriptName, 'home', 1, hostname);
    while (!ns.hasRootAccess(hostname)) {
        await ns.sleep(1000);
    }
    var freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
    var threadCount = Math.floor(freeRam / autohackMemCost);
    ns.tprintf("%s thread count: %d", scriptToExecute, threadCount);
    while (!ns.hasRootAccess(hostname)) {
        await ns.sleep(1000);
    }
    if (threadCount > 0) {
        ns.scp(scriptToExecute, hostname);
        ns.exec(scriptToExecute, hostname, threadCount, serverToHack);
    }
}

/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0]
    var servers = [];
    scan(ns).forEach(s => servers.push(ns.getServer(s)));
    servers = servers.filter(s => !s.hasAdminRights && s.requiredHackingSkill <= ns.getHackingLevel() && hasTools(ns, s.numOpenPortsRequired));
    //servers = servers.filter(s => s.hasAdminRights && s.ramUsed == 0);
    await unlockAndExecute(ns, target, target); // Make sure to hack target first
    ns.tprint(`Server found after filter: ${servers.length}`)
    for (const s of servers) {
        await unlockAndExecute(ns, s.hostname, target);
    };
}

export function autocomplete(data, args) {
    return data.servers;
}