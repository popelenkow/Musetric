import { AudioDevices } from '../..';

export type Model = {
	mediaStream: MediaStream;
	audioContext: AudioContext;
	recorder: AudioDevices.Recorder;
	wavCoder: AudioDevices.WavCoder;
};

export const createModel = async (): Promise<Model> => {
	const wavCoder = AudioDevices.createWavCoder();

	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

	const audioContext = new AudioContext();
	const source = audioContext.createMediaStreamSource(mediaStream);
	const recorder = await AudioDevices.createRecorder(source);
	return { mediaStream, audioContext, recorder, wavCoder };
};
