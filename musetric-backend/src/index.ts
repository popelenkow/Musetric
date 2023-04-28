import path from 'path';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { fastifyStatic } from '@fastify/static';
import fastify from 'fastify';
import { Api } from 'musetric-api/Api';
import { SeparationTaskInfo } from 'musetric-api/SeparationTaskInfo';
import { getCert } from './Cert';
import { getDirectories, readJson, removeDir, writeJson, writeStream } from './FileManager';
import { getMusicChunksCount } from './GetMusicChunksCount';
import { getLocalIp } from './Ip';
import { runLongLoopWorker } from './LongLoopWorker';
import { resourceDir, separationPaths } from './SeparationPaths';

runLongLoopWorker();

const start = async (): Promise<void> => {
	const ip = getLocalIp();
	const port = 3005;

	const cert = await getCert();

	const app = fastify({
		http2: true,
		https: {
			key: cert.private,
			cert: cert.cert,
		},
	});
	await app.register(multipart, {
		limits: {
			fileSize: 50_000_000, // For multipart forms, the max file size in bytes
		},
	});
	await app.register(fastifyStatic, {
		root: path.join(__dirname, '..'),
	});

	await app.register(cors, {
		origin: '*',
	});

	app.get('/ping', () => '123');
	app.post(Api.Separate.route, async (request, reply) => {
		const data = await request.file();
		if (!data) return reply.code(400).send('');

		const chunkMilliseconds = 5000;
		const id = data.filename;
		const ext = path.extname(data.filename);
		await removeDir(separationPaths.root(id));
		const trackPath = separationPaths.input(id, ext);
		await writeStream(trackPath, data.file);
		const chunksCount = await getMusicChunksCount(trackPath, chunkMilliseconds);
		const info: SeparationTaskInfo = {
			id,
			status: 'created',
			chunkMilliseconds,
			chunksCount,
			chunksDone: [],
			ext,
		};
		await writeJson(separationPaths.info(id), info);
		return reply.send(info);
	});
	app.post(Api.RemoveTrack.route, async (request, reply) => {
		// eslint-disable-next-line
		const data = request.body as Api.RemoveTrack.Request;
		const { id } = data;

		await removeDir(separationPaths.root(id));
		return reply.send({});
	});
	app.post(Api.SeparatedChunk.route, async (request, reply) => {
		// eslint-disable-next-line
		const body = JSON.parse(request.body as string) as Api.SeparatedChunk.Request;
		const { id, chunkIndex, trackType } = body;
		const filePath = separationPaths.outputChunk(id, chunkIndex, trackType);
		await reply.sendFile(filePath);
	});
	app.get(Api.SeparatedList.route, async (_, reply) => {
		const dirs = await getDirectories(resourceDir);
		const infoPaths = dirs.map((id) => separationPaths.info(id));
		const result = await Promise.all(infoPaths.map((x) => (
			readJson<SeparationTaskInfo>(x)
		)));
		const nonNullable = <T>(value: T | undefined): value is T => Boolean(value);
		const filtered: Api.SeparatedList.Response = result.filter(nonNullable);
		return reply.send(filtered);
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
