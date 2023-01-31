/** @param {NS} ns */
export async function main(ns) {
	var newRamAmount = ns.args[0];
	for (const server of ns.getPurchasedServers()) {
		const costToUpgrade = ns.getPurchasedServerUpgradeCost(server, newRamAmount);
		while (ns.getServerMoneyAvailable("home") < costToUpgrade) {
			await ns.sleep(1000);
		}
		ns.upgradePurchasedServer(server, newRamAmount);
	}
}