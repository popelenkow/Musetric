import selfsigned from 'selfsigned';
import { readJson, writeJson } from './FileManager';

type Cert = {
	private: string,
	cert: string,
};
const certPath = 'tmp/cert.json';

export const getCert = async (): Promise<Cert> => {
	const prevCert = await readJson<Cert>(certPath);
	if (prevCert) return prevCert;

	const attrs = [{ name: 'commonName', value: 'musetric.com' }];
	const pems = selfsigned.generate(attrs, { days: 1 });
	const cert = {
		private: pems.private,
		cert: pems.cert,
	};
	await writeJson(certPath, cert);
	return cert;
};
