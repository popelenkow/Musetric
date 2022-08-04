import type { PromiseObjectApi } from '../UtilityTypes';
import type { EventHandlers } from '../Types';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { PlayerWorklet, PlayerEvents } from './PlayerWorklet';

export type Player =
	& PromiseObjectApi<PlayerWorklet>
	& {
		mediaStream: MediaStream,
	};

export const createPlayer = async (
	workletUrl: URL | string,
	channelCount: number,
	handlers: EventHandlers<PlayerEvents>,
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
	const request = createPromiseWorkerApi<PlayerWorklet, PlayerEvents>(worklet.port, handlers);
	return {
		setup: (...args) => request('setup', args),
		start: (...args) => request('start', args),
		stop: (...args) => request('stop', args),
		setCursor: (...args) => request('setCursor', args),
		mediaStream,
	};
};
