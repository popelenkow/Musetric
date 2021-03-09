import { WavCoder, createWavCoder, createSoundBuffer, SoundBuffer } from '..';

export type SoundDevice = {
	audioContext: AudioContext;
	wavCoder: WavCoder;
	soundBuffer: SoundBuffer;
};

export const createSoundDevice = (channelCount = 2): SoundDevice => {
	const wavCoder = createWavCoder();

	const audioContext = new AudioContext();
	const { sampleRate } = audioContext;
	const soundBuffer = createSoundBuffer(sampleRate, channelCount);
	return { audioContext, wavCoder, soundBuffer };
};
