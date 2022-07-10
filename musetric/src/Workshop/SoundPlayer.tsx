import React, { useState, ReactElement } from 'react';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { useLazyMemoAsync } from '../ReactUtils/LazyMemo';
import { createPlayer } from '../SoundProcessing/Player';
import { useWorkerContext } from '../AppContexts/Worker';
import { skipPromise } from '../Utils/SkipPromise';

export type PlayerButtonProps = {
	disabled: boolean;
};
export type SoundPlayer = {
	isPlaying: boolean;
	renderPlayerButton: (props: PlayerButtonProps) => ReactElement;
};
export const useSoundPlayer = (soundBufferManager: SoundBufferManager): SoundPlayer => {
	const { PlayIcon, StopIcon } = useIconContext();
	const { i18n } = useLocaleContext();
	const { playerUrl } = useWorkerContext();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const getPlayer = useLazyMemoAsync(async () => {
		const { soundBuffer, cursor } = soundBufferManager;
		const { channelCount } = soundBuffer;
		const player = await createPlayer(playerUrl, channelCount, {
			onStopped: (event) => {
				const { reset } = event;
				setIsPlaying(false);
				if (reset) cursor.set(0, 'process');
			},
			onCursor: (event) => {
				const { value } = event;
				cursor.set(value, 'process');
			},
		});
		cursor.emitter.subscribe(async (event) => {
			const { inputType, value } = event;
			if (inputType === 'user') await player.setCursor(value);
		});
		return player;
	}, [soundBufferManager, playerUrl]);

	const renderPlayerButton: SoundPlayer['renderPlayerButton'] = (props) => {
		const { disabled } = props;
		const startPlaying = async () => {
			const { soundBuffer, cursor } = soundBufferManager;
			const { buffers } = soundBuffer;
			const player = await getPlayer();
			await player.setup({
				cursor: cursor.get(),
				soundBuffer: buffers[0].realRaw,
			});
			await player.start();
			setIsPlaying(true);
		};
		const stopPlaying = async () => {
			const player = await getPlayer();
			await player.stop();
		};
		const buttonProps: ButtonProps = {
			kind: 'icon',
			disabled,
			active: isPlaying,
			primary: isPlaying,
			rounded: true,
			title: isPlaying ? i18n.t('Workshop:stop') : i18n.t('Workshop:play'),
			onClick: () => skipPromise(isPlaying ? stopPlaying() : startPlaying()),
		};
		return (
			<Button {...buttonProps}>
				{isPlaying ? <StopIcon /> : <PlayIcon />}
			</Button>
		);
	};

	return {
		isPlaying,
		renderPlayerButton,
	};
};
