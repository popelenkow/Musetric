import React, { useState } from 'react';

import {
	SoundBuffer, SoundCircularBuffer,
	useWaveform, useFrequency, useSpectrogram,
	WaveformIcon, FrequencyIcon, SpectrogramIcon,
	Radio, PixelCanvas, PixelCanvasProps,
	PerformanceMonitorRef, Size2D,
} from '..';

export type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';

export type UseSoundViewProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const useSoundView = (props: UseSoundViewProps) => {
	const { soundBuffer, soundCircularBuffer, isLive, performanceMonitor } = props;
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');

	const size: Size2D = { width: 512, height: 1024 };

	const waveform = useWaveform({
		soundBuffer,
		soundCircularBuffer,
		isLive,
	});
	const frequency = useFrequency({
		soundBuffer,
		soundCircularBuffer,
		size,
		isLive,
	});
	const spectrogram = useSpectrogram({
		soundBuffer,
		soundCircularBuffer,
		size,
		isLive,
	});

	const getCanvasViewProps = (): PixelCanvasProps | undefined => {
		if (soundViewId === 'Waveform') return { ...waveform, size, direction: { rotation: 'left', reflection: false }, performanceMonitor };
		if (soundViewId === 'Frequency') return { ...frequency, size, direction: { rotation: 'twice', reflection: true }, performanceMonitor };
		if (soundViewId === 'Spectrogram') return { ...spectrogram, size, direction: { rotation: 'twice', reflection: true }, performanceMonitor };
		return undefined;
	};

	const canvasViewProps = getCanvasViewProps();

	const soundView = canvasViewProps && <PixelCanvas {...canvasViewProps} />;

	const waveformRadio = <Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>;
	const frequencyRadio = <Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>;
	const spectrogramRadio = <Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>;

	return { soundView, waveformRadio, frequencyRadio, spectrogramRadio };
};
