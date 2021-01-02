// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler<T = any> = (id: string, options: T) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultCallback<T = any> = (result: T) => void;

export type MessageId = { id: string };

export type InitOptions = {
	sampleRate: number;
	numChannels: number;
};
export type ClearOptions = Record<string, unknown>;
export type RecordOptions = {
	inputBuffer: Float32Array[];
};
export type ExportWavOptions = {
	mimeType?: string;
};
export type GetBufferOptions = Record<string, unknown>;
export type InMessage = MessageId & (
	| { type: 'init', options: InitOptions }
	| { type: 'clear', options?: ClearOptions }
	| { type: 'record', options: RecordOptions }
	| { type: 'exportWav', options: ExportWavOptions }
	| { type: 'getBuffer', options?: GetBufferOptions }
);
export type InMessageType = InMessage['type'];

export type GetBufferResult = Float32Array[];
export type ExportWavResult = Blob;
export type OutMessage = MessageId & (
	| { type: 'getBuffer', result: GetBufferResult }
	| { type: 'exportWav', result: ExportWavResult }
);
export type OutMessageType = OutMessage['type'];

export type InWorker = {
	postMessage: (message: OutMessage) => void;
	onmessage: ((this: Worker, ev: MessageEvent<InMessage>) => void) | null;
};
export type OutWorker = {
	postMessage: (message: InMessage) => void;
	onmessage: ((this: Worker, ev: MessageEvent<OutMessage>) => void) | null;
};

export type Config = {
	bufferLen?: number;
	numChannels: number;
	mimeType?: string;
};
