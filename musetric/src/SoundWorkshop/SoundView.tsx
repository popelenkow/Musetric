import React, { useState } from 'react';

import {
	SoundBuffer, SoundCircularBuffer,
	useWaveform, useFrequency, useSpectrogram,
	WaveformIcon, FrequencyIcon, SpectrogramIcon,
	Radio, CanvasView, PerformanceMonitorRef,
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

	const viewProps = {
		soundBuffer,
		soundCircularBuffer,
		size: { width: 1024, height: 1024 },
		isLive,
	};

	const waveformProps = useWaveform(viewProps);
	const frequencyProps = useFrequency(viewProps);
	const spectrogramProps = useSpectrogram(viewProps);

	const getCanvasViewProps = () => {
		if (soundViewId === 'Waveform') return { ...waveformProps, performanceMonitor };
		if (soundViewId === 'Frequency') return { ...frequencyProps, performanceMonitor };
		if (soundViewId === 'Spectrogram') return { ...spectrogramProps, performanceMonitor };
		return undefined;
	};

	const canvasViewProps = getCanvasViewProps();

	const soundView = canvasViewProps && <CanvasView {...canvasViewProps} />;

	const waveformRadio = <Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>;
	const frequencyRadio = <Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>;
	const spectrogramRadio = <Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>;

	return { soundView, waveformRadio, frequencyRadio, spectrogramRadio };
};
