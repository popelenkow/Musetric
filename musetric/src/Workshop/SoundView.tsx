import React, { useState, useMemo, ReactElement } from 'react';
import { SoundBufferManager } from '../Sounds';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { Size2D, Direction2D, Layout2D } from '../Rendering/Layout';
import { Waveform, WaveformProps } from '../Controls/Waveform';
import { Frequency, FrequencyProps } from '../Controls/Frequency';
import { Spectrogram, SpectrogramProps } from '../Controls/Spectrogram';
import type { SoundParameters } from './SoundParameters';

type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';
export type UseSoundViewProps = {
	soundBufferManager: SoundBufferManager;
	soundParameters: SoundParameters;
	isLive: boolean;
};
const useWaveformItem = (props: UseSoundViewProps) => {
	const waveformLayout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 1024, height: 512 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveformProps: WaveformProps = {
		...props,
		layout: waveformLayout,
	};
	return <Waveform {...waveformProps} />;
};

const useFrequencyItem = (props: UseSoundViewProps) => {
	const frequencyLayout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 512, height: 1024 };
		const direction: Direction2D = { rotation: 'twice', reflection: true };
		return { size, direction };
	}, []);
	const frequencyProps: FrequencyProps = {
		...props,
		layout: frequencyLayout,
	};
	return <Frequency {...frequencyProps} />;
};

const useSpectrogramItem = (props: UseSoundViewProps) => {
	const spectrogramLayout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 1024, height: 512 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const spectrogramProps: SpectrogramProps = {
		...props,
		layout: spectrogramLayout,
	};
	return <Spectrogram {...spectrogramProps} />;
};

export type SoundView = {
	renderSoundView: () => ReactElement | null;
	renderWaveformButton: () => ReactElement;
	renderFrequencyButton: () => ReactElement;
	renderSpectrogramButton: () => ReactElement;
};
export const useSoundView = (props: UseSoundViewProps): SoundView => {
	const { WaveformIcon, FrequencyIcon, SpectrogramIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');

	const waveform = useWaveformItem({ ...props });
	const frequency = useFrequencyItem({ ...props });
	const spectrogram = useSpectrogramItem({ ...props });

	const renderSoundView = () => {
		if (soundViewId === 'Waveform') return waveform;
		if (soundViewId === 'Frequency') return frequency;
		if (soundViewId === 'Spectrogram') return spectrogram;
		return null;
	};
	const renderWaveformButton = () => {
		const waveformButtonProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: i18n.t('Workshop:waveform'),
			primary: soundViewId === 'Waveform',
			onClick: () => setSoundViewId('Waveform'),
		};
		return (
			<Button {...waveformButtonProps}>
				<WaveformIcon />
			</Button>
		);
	};
	const renderFrequencyButton = () => {
		const frequencyButtonProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: i18n.t('Workshop:frequency'),
			primary: soundViewId === 'Frequency',
			onClick: () => setSoundViewId('Frequency'),
		};
		return (
			<Button {...frequencyButtonProps}>
				<FrequencyIcon />
			</Button>
		);
	};
	const renderSpectrogramButton = () => {
		const spectrogramButtonProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: i18n.t('Workshop:spectrogram'),
			primary: soundViewId === 'Spectrogram',
			onClick: () => setSoundViewId('Spectrogram'),
		};
		return (
			<Button {...spectrogramButtonProps}>
				<SpectrogramIcon />
			</Button>
		);
	};
	return {
		renderSoundView,
		renderWaveformButton,
		renderFrequencyButton,
		renderSpectrogramButton,
	};
};
