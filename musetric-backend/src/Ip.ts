import { networkInterfaces } from 'os';

export const getLocalIp = (): string => {
	const nets = networkInterfaces();
	const results: Record<string, string[]> = {};

	Object.entries(nets).forEach(([name, nn]) => {
		nn?.forEach((net) => {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
			const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
			if (net.internal || net.family !== familyV4Value) return;
			if (!results[name]) {
				results[name] = [];
			}
			results[name].push(net.address);
		});
	});
	return Object.entries(results).map((x) => x[1][0])[0];
};
