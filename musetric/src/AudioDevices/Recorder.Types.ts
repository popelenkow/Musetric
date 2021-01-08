// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler<T = any> = (id: string, options: T) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultCallback<T = any> = (result: T) => void;

export type MessageId = { id: string };

export type InitOptions = {
	channelCount: number;
};

export type InMessage = MessageId & (
	| { type: 'init', options: InitOptions }
	| { type: 'start', options?: void }
	| { type: 'stop', options?: void }
	| { type: 'clear', options?: void }
	| { type: 'getBuffer', options?: void }
	| { type: 'subscribe', options?: void }
	| { type: 'unsubscribe', options?: void }
);
export type InMessageType = InMessage['type'];

export type GetBufferResult = Float32Array[];
export type SubscriptionResult = Float32Array[];

export type OutMessage = MessageId & (
	| { type: 'getBuffer', result: GetBufferResult }
	| { type: 'subscription', result: SubscriptionResult }
);
export type OutMessageType = OutMessage['type'];

export type Config = {
	channelCount: number;
};
