import { AudioDevices } from '../..';

export type Model = {
	mediaStream: MediaStream;
	recorder: AudioDevices.Recorder;
};

export const createModel = async (): Promise<Model> => {
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

	const audioContext = new AudioContext();
	const source = audioContext.createMediaStreamSource(mediaStream);
	const inputPoint = audioContext.createGain();
	source.connect(inputPoint);
	const recorder = AudioDevices.createRecorder(inputPoint);
	return { mediaStream, recorder };
};
