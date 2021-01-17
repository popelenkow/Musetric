import { Recorder, WavCoder, createWavCoder, createRecorder } from '.';

export type RecorderDevice = {
	mediaStream: MediaStream;
	audioContext: AudioContext;
	recorder: Recorder;
	wavCoder: WavCoder;
};

export const createRecorderDevice = async (): Promise<RecorderDevice> => {
	const wavCoder = createWavCoder();

	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

	const audioContext = new AudioContext();
	const source = audioContext.createMediaStreamSource(mediaStream);
	const recorder = await createRecorder(source);
	return { mediaStream, audioContext, recorder, wavCoder };
};
