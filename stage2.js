/** @param {NS} ns */
export async function main(ns) {
	const serverToHack = 'joesguns';
	const ramReserveOnHome = 16; // reserve 16GB
	const unlockScriptName = 'unlock.js';
	const scriptToExecute = 'autohack.js';
	const upgradeServersScript = 'upgradeServers.js';
	const switchTargetsScript = 'switchNodeTarget.js';
	const autohackMemCost = ns.getScriptRam(scriptToExecute);

	function unlockAndExecute(hostname) {
		ns.tprintf("Unlocking hostanme: %s", hostname);
		ns.exec(unlockScriptName, 'home', 1, hostname);
		var freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
		var threadCount = Math.floor(freeRam / autohackMemCost);
		ns.tprintf("%s thread count: %d", scriptToExecute, threadCount);
		if (threadCount > 0) {
			ns.scp(scriptToExecute, hostname);
			ns.exec(scriptToExecute, hostname, threadCount, serverToHack);
		}
	}

	unlockAndExecute(serverToHack);
	var freeRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home') - ramReserveOnHome;
	var threadCount = Math.floor(freeRam / autohackMemCost);
	ns.tprintf("Running %d thread for %s on %s", threadCount, scriptToExecute, serverToHack);
	if (threadCount > 0){
		ns.exec(scriptToExecute, 'home', threadCount, serverToHack);
	}
	
	ns.tprintf("Waiting for full node lits");

	while (ns.getPurchasedServerLimit() < ns.getPurchasedServers().length) {
		await ns.sleep(5000);
	}

	ns.tprintf("Got all servers - upgrade to 16GB RAM");
	var upgradePid = ns.exec(upgradeServersScript, 'home', 1, 16); // Upgrade servers to 16GB

	while (ns.isRunning(upgradePid)){
		await ns.sleep(1000);
	}

	ns.tprintf("Upgrade done, switching servers to hack %s", serverToHack);
	ns.exec(switchTargetsScript, 'home', 1, serverToHack);
	// hack other servers
	
	// END of hacking
	ns.tprintf("Upgrade servers to 32GB RAM");
	upgradePid = ns.exec(upgradeServersScript, 'home', 1, 32); // Upgrade servers to 32GB

	while (ns.isRunning(upgradePid)){
		await ns.sleep(1000);
	}

	ns.tprintf("Upgrade done, switching servers to hack %s", serverToHack);
	ns.exec(switchTargetsScript, 'home', 1, serverToHack);
}

// Stage 2 when we have tools to hack more serves, and can push more power to already unloced ones