import { Recorder, WavCoder, createWavCoder, createRecorder, createSoundBuffer, SoundBuffer } from '..';

export type RecorderDevice = {
	audioContext: AudioContext;
	recorder: Recorder;
	wavCoder: WavCoder;
	soundBuffer: SoundBuffer;
};

export const createRecorderDevice = async (channelCount = 2): Promise<RecorderDevice> => {
	const wavCoder = createWavCoder();

	const audioContext = new AudioContext();
	const { sampleRate } = audioContext;
	const soundBuffer = createSoundBuffer(sampleRate, channelCount);
	const recorder = await createRecorder(audioContext, soundBuffer);
	return { audioContext, recorder, wavCoder, soundBuffer };
};
