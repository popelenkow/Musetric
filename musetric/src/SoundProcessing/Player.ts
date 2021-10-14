import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseAudioWorkletApi } from '../Workers/PromiseAudioWorkletApi';
import type { PlayerWorklet, PlayerWorkletEvents } from './PlayerWorklet';

export type Player =
	& PromiseObjectApi<PlayerWorklet>
	& PlayerWorkletEvents
	& {
		mediaStream: MediaStream;
	};
const playerTemplate: UndefinedObject<PlayerWorklet> = {
	setup: undefined,
	start: undefined,
	stop: undefined,
	setCursor: undefined,
};

export const createPlayer = async (
	workletUrl: URL | string,
	channelCount: number,
): Promise<Player> => {
	const audioContext = new AudioContext();
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount } });
	const source = audioContext.createMediaStreamSource(mediaStream);
	source.channelCount = channelCount;
	const options: AudioWorkletNodeOptions = {
		channelCount,
		numberOfOutputs: 1,
		numberOfInputs: 0,
	};
	await audioContext.audioWorklet.addModule(workletUrl);
	const worklet = new AudioWorkletNode(audioContext, 'PlayerWorklet', options);
	worklet.connect(audioContext.destination);
	const api = createPromiseAudioWorkletApi<PlayerWorklet>(worklet, playerTemplate);
	const result = api as Player;
	result.mediaStream = mediaStream;
	return result;
};
