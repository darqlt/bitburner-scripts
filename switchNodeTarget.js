/** @param {NS} ns */
export async function main(ns) {
	const scriptToExecute = 'autohack.js';
	const autohackMemCost = ns.getScriptRam(scriptToExecute);
	const serverToHack = ns.args[0] ? ns.args[0] : 'n00dles';

	ns.getPurchasedServers().forEach(hostname => {
		ns.killall(hostname);
		ns.exec(scriptToExecute, hostname, Math.floor(ns.getServerMaxRam(hostname) / autohackMemCost), serverToHack);
	});
}

// Switch bought node target (or reset if we got more RAM)