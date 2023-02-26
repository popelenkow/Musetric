import React, { useMemo, useCallback } from 'react';
import { Waveform, WaveformProps } from '../../Controls/Waveform';
import { Size2D, Direction2D, Layout2D } from '../../Rendering/Layout';
import { SFC } from '../../UtilityTypes/React';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

export const createSoundProgressBarLayout = (): Layout2D => {
	const size: Size2D = { width: 128, height: 1024 };
	const direction: Direction2D = { rotation: 'left', reflection: false };
	return { size, direction };
};

const select = ({
	soundBufferManager,
}: SoundWorkshopSnapshot) => ({
	soundBufferManager,
} as const);

export const SoundProgressBar: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundBufferManager } = store;

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

	return (
		<Waveform {...waveformProps} />
	);
};
