import React, { useMemo, ReactElement, useCallback } from 'react';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { Size2D, Direction2D } from '../Rendering/Layout';
import { Waveform, WaveformProps } from '../Controls/Waveform';

export const createSoundProgressBarLayout = () => {
	const size: Size2D = { width: 128, height: 1024 };
	const direction: Direction2D = { rotation: 'left', reflection: false };
	return { size, direction };
};

export type SoundProgressBar = {
	renderProgressBarView: () => ReactElement;
};
export const useSoundProgressBar = (
	soundBufferManager: SoundBufferManager,
): SoundProgressBar => {
	const soundProgressBarLayout = useMemo(() => createSoundProgressBarLayout(), []);

	const getCursor = useCallback(() => {
		const { soundBuffer, cursor } = soundBufferManager;
		return cursor.get() / (soundBuffer.length - 1);
	}, [soundBufferManager]);
	const getBuffer = useCallback(() => {
		const { soundBuffer } = soundBufferManager;
		return soundBuffer.buffers[0];
	}, [soundBufferManager]);

	const waveformProps: WaveformProps = {
		getBuffer,
		getCursor,
		setCursor: (newCursor: number) => {
			const { soundBuffer, cursor } = soundBufferManager;
			const value = Math.floor(newCursor * (soundBuffer.length - 1));
			cursor.set(value, 'user');
		},
		layout: soundProgressBarLayout,
	};

	return {
		renderProgressBarView: () => <Waveform {...waveformProps} />,
	};
};
