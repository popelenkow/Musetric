import React, { useState, useMemo } from 'react';
import {
	SoundBuffer, SoundCircularBuffer,
	useWaveform, useFrequency, useSpectrogram,
	WaveformIcon, FrequencyIcon, SpectrogramIcon,
	Radio, PixelCanvas, PixelCanvasProps,
	PerformanceMonitorRef, Size2D, Direction2D,
} from '..';

export type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';

export type UseSoundViewProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const useSoundView = (props: UseSoundViewProps) => {
	const { performanceMonitor } = props;
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');

	const waveformLayout = useMemo(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveform = useWaveform({ ...props });
	const waveformProps: PixelCanvasProps = {
		...waveform, ...waveformLayout, performanceMonitor,
	};

	const frequencyLayout = useMemo(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'twice', reflection: true };
		return { size, direction };
	}, []);
	const frequency = useFrequency({
		...props, ...frequencyLayout,
	});
	const frequencyProps: PixelCanvasProps = {
		...frequency, ...frequencyLayout, performanceMonitor,
	};

	const spectrogramLayout = useMemo(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'twice', reflection: true };
		return { size, direction };
	}, []);
	const spectrogram = useSpectrogram({
		...props, ...spectrogramLayout,
	});
	const spectrogramProps: PixelCanvasProps = {
		...spectrogram, ...spectrogramLayout, performanceMonitor,
	};

	const getCanvasViewProps = (): PixelCanvasProps | undefined => {
		if (soundViewId === 'Waveform') return waveformProps;
		if (soundViewId === 'Frequency') return frequencyProps;
		if (soundViewId === 'Spectrogram') return spectrogramProps;
		return undefined;
	};

	const canvasViewProps = getCanvasViewProps();

	const soundView = canvasViewProps && <PixelCanvas {...canvasViewProps} />;

	const waveformRadio = <Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>;
	const frequencyRadio = <Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>;
	const spectrogramRadio = <Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>;

	return { soundView, waveformRadio, frequencyRadio, spectrogramRadio };
};
