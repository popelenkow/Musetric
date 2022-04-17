import React, { useState, useMemo, useCallback } from 'react';
import { SoundBufferManager, SoundBufferEvent } from '../Sounds/SoundBufferManager';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { Size2D, Direction2D, Layout2D } from '../Rendering/Layout';
import { Waveform } from '../Controls/Waveform';
import { Frequency } from '../Controls/Frequency';
import { Spectrogram } from '../Controls/Spectrogram';
import type { SoundParameters } from './SoundParameters';
import { EventEmitterCallback } from '../Utils/EventEmitter';

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

export type UseSoundViewProps = {
	soundBufferManager: SoundBufferManager;
	soundParameters: SoundParameters;
	isLive: boolean;
};

export const useSoundViewItemProps = (props: UseSoundViewProps) => {
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
		soundParameters,
	};
};
export type SoundViewItemProps = ReturnType<typeof useSoundViewItemProps>;

export const useSoundView = (props: UseSoundViewProps) => {
	const { WaveformIcon, FrequencyIcon, SpectrogramIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');
	const itemProps = useSoundViewItemProps(props);
	const waveformLayout = useMemo(() => createWaveformLayout(), []);
	const frequencyLayout = useMemo(() => createFrequencyLayout(), []);
	const spectrogramLayout = useMemo(() => createSpectrogramLayout(), []);

	const renderSoundView = () => {
		if (soundViewId === 'Waveform') return <Waveform {...itemProps} layout={waveformLayout} />;
		if (soundViewId === 'Frequency') return <Frequency {...itemProps} layout={frequencyLayout} />;
		if (soundViewId === 'Spectrogram') return <Spectrogram {...itemProps} layout={spectrogramLayout} />;
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
	} as const;
};
export type SoundView = ReturnType<typeof useSoundView>;
