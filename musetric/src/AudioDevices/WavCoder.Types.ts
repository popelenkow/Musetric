// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler<T = any> = (id: string, options: T) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultCallback<T = any> = (result: T) => void;

export type MessageId = { id: string };

export type EncodeOptions = {
	sampleRate: number;
	buffers: Float32Array[]
};
export type InMessage = MessageId & (
	| { type: 'encode', options: EncodeOptions }
);
export type InMessageType = InMessage['type'];

export type EncodeResult = Blob;
export type OutMessage = MessageId & (
	| { type: 'encode', result: EncodeResult }
);
export type OutMessageType = OutMessage['type'];
