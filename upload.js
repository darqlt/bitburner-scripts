/** @param {NS} ns */
export async function main(ns) {
    const scriptToExecute = 'autohack.js';
	var target = ns.args[0];
    var threads = ns.args[1] ? ns.args[1] : Math.floor((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) /  ns.getScriptRam(scriptToExecute));
    var serverToHack = ns.args[2] ? ns.args[2] : target;
    ns.scp(scriptToExecute, target);
    if (threads > 0) {
        ns.tprintf("%s thread count: %d", scriptToExecute, threads);
        ns.exec(scriptToExecute, target, threads, serverToHack);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}