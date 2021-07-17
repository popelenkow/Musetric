/* eslint-disable @typescript-eslint/no-explicit-any */
export type PromiseAudioWorkletRequest = {
	id: string;
	type: string;
	args: any[];
};
export type PromiseAudioWorkletResponse = {
	id: string;
	type: string;
	result: any;
};
// eslint-disable-next-line max-len
export type PromiseAudioWorkletHandlers = { process: (inputRaw: Float32Array[]) => void; } & Record<string, (...args: any[]) => any>;
export type PromiseAudioWorkletApi = Record<string, (...args: any[]) => Promise<any>>;
export type PostPromiseAudioWorklet = (message: PromiseAudioWorkletResponse) => void;
export type PromiseAudioWorkletOptions = {
	post: PostPromiseAudioWorklet;
	sampleRate: number;
};
