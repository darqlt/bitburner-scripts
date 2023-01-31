/** @param {NS} ns */
export async function main(ns) {
	const serversToHack = ['sigma-cosmetics'];
	const serverToHack = 'n00dles';
	const unlockScriptName = 'unlock.js';
	const scriptToExecute = 'autohack.js';
	const free = ['n00dles', 'foodnstuff'];
	const autohackMemCost = ns.getScriptRam(scriptToExecute);

	function unlockAndExecute(hostname) {
		ns.tprintf("Unlocking hostanme: %s", hostname);
		ns.exec(unlockScriptName, 'home', 1, hostname);
		while (!ns.hasRootAccess(hostname)) {
			await ns.sleep(1000);
		}
		var freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
		var threadCount = Math.floor(freeRam / autohackMemCost);
		ns.tprintf("%s thread count: %d", scriptToExecute, threadCount);
		if (threadCount > 0) {
			ns.scp(scriptToExecute, hostname);
			ns.exec(scriptToExecute, hostname, threadCount, serverToHack);
		}
	}
	// run script on free servers
	free.forEach(unlockAndExecute);

	// run script on home pc (it's cheaper to use exec in this script instead of run)
	ns.tprintf("Running 30 threads on 'Home' for %s hacking %s", scriptToExecute, serverToHack);
	ns.exec(scriptToExecute, 'home', 30, serverToHack);

	// try hack all others
	for (const hostname of serversToHack) {
		while (ns.getServerRequiredHackingLevel(hostname) > ns.getHackingLevel()) {
			await ns.sleep(1000);
		}
		unlockAndExecute(hostname);
	}

	ns.tprintf("Time to buy VMs");
	ns.exec('buy-8gb-servers.js', 'home');
}

// My initial script after prestige/reset