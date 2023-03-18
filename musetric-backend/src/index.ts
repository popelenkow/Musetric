import fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastify from 'fastify';
import selfsigned from 'selfsigned';
import { getLocalIp } from './ip';

const pump = util.promisify(pipeline);

const start = async (): Promise<void> => {
	const ip = getLocalIp();
	const port = 3005;

	const attrs = [{ name: 'commonName', value: 'musetric.com' }];
	const pems = selfsigned.generate(attrs, { days: 1 });

	const app = fastify({
		http2: true,
		https: {
			key: pems.private,
			cert: pems.cert,
		},
	});
	await app.register(multipart, {
		limits: {
			fileSize: 50_000_000, // For multipart forms, the max file size in bytes
		},
	});

	await app.register(cors, {
		origin: '*',
	});

	app.get('/ping', () => '123');
	app.post('/upload', async (request, reply) => {
		const data = await request.file();
		if (!data) return reply.code(400).send('');

		const stream = fs.createWriteStream(data.filename);
		await pump(data.file, stream);
		stream.end();

		return reply.send();
	});

	app.listen({ port, host: '::' }, (error) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
		console.log(`https://${ip}:${port}/ping`);
	});
};

start().finally(() => {});
