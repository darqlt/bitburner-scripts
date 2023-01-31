/** @param {NS} ns */
export async function main(ns) {
	// ns.scan("home").forEach(e => ns.pr(e));

	ns.getPurchasedServers().forEach(server => {
		ns.scp("autohack.js", server);
	});
}

// I think this one is not used also