import { UndefinedObject } from '../Typescript/UndefinedObject';

export type PromiseWorkerRequest = {
	id: string;
	type: string;
	args: unknown[];
};
export type PromiseWorkerResponse = {
	id: string;
	type: string;
	result: unknown;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseWorker = Record<string, (...args: any[]) => unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseWorkerEvents = Record<string, (result: any) => void>;

export type PromiseWorkerOptions<Events extends PromiseWorkerEvents> = {
	events: Events;
};
export const runPromiseWorker = <Events extends PromiseWorkerEvents>(
	host: Worker,
	createWorker: (options: PromiseWorkerOptions<Events>) => PromiseWorker,
	templateEvents?: UndefinedObject<Events>,
): void => {
	const post = (message: PromiseWorkerResponse) => {
		host.postMessage(message);
	};

	const events: PromiseWorkerEvents = {};
	Object.keys(templateEvents || {}).forEach((type) => {
		events[type] = (result: unknown) => {
			const id = '';
			post({ id, type, result });
		};
	});

	const options: PromiseWorkerOptions<Events> = {
		events: events as Events,
	};
	const worker = createWorker(options);
	host.onmessage = (e: MessageEvent<PromiseWorkerRequest>) => {
		const { id, type, args } = e.data;
		const result = worker[type](...args);
		post({ id, type, result });
	};
};
