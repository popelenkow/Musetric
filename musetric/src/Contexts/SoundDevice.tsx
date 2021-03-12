import React, { useState } from 'react';
import { SoundBuffer, SoundDevice, createSoundDevice } from '..';

export type SoundDeviceStore = {
	soundBuffer?: SoundBuffer;
	getSoundDevice: () => SoundDevice;
	setFile: (file: File) => Promise<Blob>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SoundDeviceContext = React.createContext<SoundDeviceStore>({} as any);

export const SoundDeviceConsumer = SoundDeviceContext.Consumer;

export type SoundDeviceProviderProps = {
};

export const SoundDeviceProvider: React.FC<SoundDeviceProviderProps> = (props) => {
	const { children } = props;

	// eslint-disable-next-line prefer-const
	let [soundDevice, setSoundDevice] = useState<SoundDevice>();

	const getSoundDevice = () => {
		if (!soundDevice) {
			soundDevice = createSoundDevice();
			setSoundDevice(soundDevice);
		}
		return soundDevice;
	};

	const setFile = async (file: File) => {
		if (!soundDevice) {
			soundDevice = createSoundDevice();
			setSoundDevice(soundDevice);
		}
		const { audioContext, soundBuffer, wavCoder } = soundDevice;
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const buffers: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			buffers[i] = audioBuffer.getChannelData(i);
		}
		soundBuffer.push(buffers);
		const { sampleRate } = audioContext;
		const b = await wavCoder.encode({ buffers, sampleRate });
		return b;
	};

	const store: SoundDeviceStore = {
		soundBuffer: soundDevice?.soundBuffer,
		getSoundDevice,
		setFile,
	};

	return (
		<SoundDeviceContext.Provider value={store}>
			{children}
		</SoundDeviceContext.Provider>
	);
};
