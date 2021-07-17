import React, { useState, useMemo } from 'react';
import {
	MasterCanvas, MasterCanvasItem, MasterCanvasProps,
	SoundBuffer, SoundCircularBuffer,
	useWaveform, useFrequency, useSpectrogram,
	WaveformIcon, FrequencyIcon, SpectrogramIcon,
	Radio, PerformanceMonitorRef, Size2D, Direction2D, Layout2D,
	rotateSize2D,
} from '..';

type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';

export type UseSoundViewProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

type UseItemProps = UseSoundViewProps & {
	soundViewId: SoundViewId;
};

const useWaveformItem = (props: UseItemProps) => {
	const layout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 1024, height: 512 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const { image, onClick } = useWaveform({
		...props,
		size: layout.size,
		pause: props.soundViewId !== 'Waveform',
	});
	const result = useMemo(() => {
		const size = rotateSize2D(layout.size, layout.direction);
		const item: MasterCanvasItem = { image, layout, onClick };
		const items = [item];
		return { size, items };
	}, [image, layout, onClick]);

	return result;
};

const useFrequencyItem = (props: UseItemProps) => {
	const layout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'twice', reflection: true };
		return { size, direction };
	}, []);
	const { image } = useFrequency({
		...props,
		size: layout.size,
		pause: props.soundViewId !== 'Frequency',
	});
	const result = useMemo(() => {
		const size = rotateSize2D(layout.size, layout.direction);
		const item: MasterCanvasItem = { image, layout };
		const items = [item];
		return { size, items };
	}, [image, layout]);

	return result;
};

const useSpectrogramItem = (props: UseItemProps) => {
	const layout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'twice', reflection: true };
		return { size, direction };
	}, []);
	const { image, onClick } = useSpectrogram({
		...props,
		size: layout.size,
		pause: props.soundViewId !== 'Spectrogram',
	});
	const result = useMemo(() => {
		const size = rotateSize2D(layout.size, layout.direction);
		const item: MasterCanvasItem = {
			image,
			layout,
			onClick,
		};
		const items = [item];
		return { size, items };
	}, [image, layout, onClick]);

	return result;
};

export const useSoundView = (props: UseSoundViewProps) => {
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');

	const waveform = useWaveformItem({ ...props, soundViewId });
	const frequency = useFrequencyItem({ ...props, soundViewId });
	const spectrogram = useSpectrogramItem({ ...props, soundViewId });

	const masterCanvasProps = useMemo<MasterCanvasProps>(() => {
		if (soundViewId === 'Waveform') return waveform;
		if (soundViewId === 'Frequency') return frequency;
		if (soundViewId === 'Spectrogram') return spectrogram;
		const size: Size2D = { width: 0, height: 0 };
		const items: MasterCanvasItem[] = [];
		return { size, items };
	}, [soundViewId, waveform, frequency, spectrogram]);
	const soundView = <MasterCanvas {...masterCanvasProps} />;

	const waveformRadio = <Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>;
	const frequencyRadio = <Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>;
	const spectrogramRadio = <Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>;

	return { soundView, waveformRadio, frequencyRadio, spectrogramRadio };
};
