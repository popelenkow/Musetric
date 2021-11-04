import React, { useState, useMemo, ReactElement } from 'react';
import { SoundBufferManager } from '../Sounds';
import { useIconContext } from '../AppContexts/Icon';
import { MasterCanvas, MasterCanvasProps, MasterCanvasItem } from '../RenderingComponents/MasterCanvas';
import { Radio } from '../Controls/Radio';
import { Size2D, Direction2D, Layout2D, rotateSize2D } from '../Rendering/Layout';
import { useWaveform } from '../RenderingComponents/Waveform';
import { useFrequency } from '../RenderingComponents/Frequency';
import { useSpectrogram } from '../RenderingComponents/Spectrogram';

type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';
export type UseSoundViewProps = {
	soundBufferManager: SoundBufferManager;
	isLive: boolean;
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
		const size: Size2D = { width: 1024, height: 512 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
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

export type SoundView = {
	renderSoundView: () => ReactElement;
	renderWaveformRadio: () => ReactElement;
	renderFrequencyRadio: () => ReactElement;
	renderSpectrogramRadio: () => ReactElement;
};
export const useSoundView = (props: UseSoundViewProps): SoundView => {
	const { WaveformIcon, FrequencyIcon, SpectrogramIcon } = useIconContext();

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

	return {
		renderSoundView: () => <MasterCanvas {...masterCanvasProps} />,
		renderWaveformRadio: () => (
			<Radio label='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId} rounded>
				<WaveformIcon />
			</Radio>
		),
		renderFrequencyRadio: () => (
			<Radio label='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId} rounded>
				<FrequencyIcon />
			</Radio>
		),
		renderSpectrogramRadio: () => (
			<Radio label='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId} rounded>
				<SpectrogramIcon />
			</Radio>
		),
	};
};
