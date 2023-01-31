/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0]

    if (ns.fileExists("BruteSSH.exe")) {
        ns.brutessh(target)
    }
    if (ns.fileExists("FTPCrack.exe")) {
        ns.ftpcrack(target)
    }
    if (ns.fileExists("RelaySMTP.exe")) {
        ns.relaysmtp(target)
    }
    if (ns.fileExists("HTTPWorm.exe")) {
        ns.httpworm(target)
    }
    if (ns.fileExists("SQLInject.exe")) {
        ns.sqlinject(target)
    }
    try {
        ns.nuke(target)
    } catch {
        ns.tprint("You're missing a Port opener")
    }
}

export function autocomplete(data, args) {
    return data.servers;
}