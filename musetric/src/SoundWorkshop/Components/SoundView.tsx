import React, { useMemo, useCallback, ReactElement } from 'react';
import { SoundBufferManager, SoundBufferEvent } from '../../Sounds/SoundBufferManager';
import { Size2D, Direction2D, Layout2D } from '../../Rendering/Layout';
import { Waveform } from '../../Controls/Waveform';
import { Frequency } from '../../Controls/Frequency';
import { Spectrogram } from '../../Controls/Spectrogram';
import { SoundParameters, useSoundWorkshopStore } from '../Store';
import { EventEmitterCallback } from '../../Utils/EventEmitter';

export const createWaveformLayout = (): Layout2D => {
	const size: Size2D = { width: 1024, height: 512 };
	const direction: Direction2D = { rotation: 'left', reflection: false };
	return { size, direction };
};
export const createFrequencyLayout = (): Layout2D => {
	const size: Size2D = { width: 512, height: 1024 };
	const direction: Direction2D = { rotation: 'twice', reflection: true };
	return { size, direction };
};
export const createSpectrogramLayout = (): Layout2D => {
	const size: Size2D = { width: 1024, height: 512 };
	const direction: Direction2D = { rotation: 'left', reflection: false };
	return { size, direction };
};

export type SoundViewProps = {
	soundBufferManager: SoundBufferManager,
	soundParameters: SoundParameters,
	isLive: boolean,
};
export const useSoundViewItemProps = (props: SoundViewProps) => {
	const { soundBufferManager, soundParameters, isLive } = props;

	const getBuffer = useCallback(() => {
		const { soundBuffer, soundCircularBuffer } = soundBufferManager;
		return isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
	}, [soundBufferManager, isLive]);

	const getCursor = useCallback(() => {
		const { soundBuffer, cursor } = soundBufferManager;
		return isLive ? undefined : cursor.get() / (soundBuffer.length - 1);
	}, [soundBufferManager, isLive]);

	const setCursor = useCallback((newCursor: number) => {
		if (isLive) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const value = Math.floor(newCursor * (soundBuffer.length - 1));
		cursor.set(value, 'user');
	}, [soundBufferManager, isLive]);

	const subscribeBufferEvents = useCallback((callback: EventEmitterCallback<SoundBufferEvent>) => {
		const bufferEventEmitter = isLive
			? soundBufferManager.circularBufferEventEmitter
			: soundBufferManager.bufferEventEmitter;
		return bufferEventEmitter.subscribe(callback);
	}, [soundBufferManager, isLive]);

	return {
		getBuffer,
		getCursor,
		setCursor,
		subscribeBufferEvents,
		frequencyRange: soundParameters.frequencyRange,
		sampleRate: soundParameters.sampleRate,
	};
};
export type SoundViewItemProps = ReturnType<typeof useSoundViewItemProps>;

export function SoundView(props: SoundViewProps): ReactElement | null {
	const store = useSoundWorkshopStore();
	const { soundViewId } = store;

	const itemProps = useSoundViewItemProps(props);
	const waveformLayout = useMemo(() => createWaveformLayout(), []);
	const frequencyLayout = useMemo(() => createFrequencyLayout(), []);
	const spectrogramLayout = useMemo(() => createSpectrogramLayout(), []);

	if (soundViewId === 'Waveform') return <Waveform {...itemProps} layout={waveformLayout} />;
	if (soundViewId === 'Frequency') return <Frequency {...itemProps} layout={frequencyLayout} />;
	if (soundViewId === 'Spectrogram') return <Spectrogram {...itemProps} layout={spectrogramLayout} />;
	return null;
}
