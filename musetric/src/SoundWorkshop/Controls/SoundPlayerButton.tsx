import React from 'react';
import { useIconContext, useWorkerContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { useLazyMemoAsync } from '../../ReactUtils';
import { createPlayer } from '../../SoundProcessing';
import { SoundBufferManager } from '../../Sounds';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';

export type SoundPlayerButtonProps = {
	disabled: boolean,
	soundBufferManager: SoundBufferManager,
	isPlaying: boolean,
	setIsPlaying: (value: boolean) => void,
};
export const SoundPlayerButton: SFC<SoundPlayerButtonProps> = (props) => {
	const { disabled, soundBufferManager, isPlaying, setIsPlaying } = props;

	const { PlayIcon, StopIcon } = useIconContext();
	const { i18n } = useLocaleContext();
	const { playerUrl } = useWorkerContext();

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
	}, [soundBufferManager, playerUrl, setIsPlaying]);

	const startPlaying = async (): Promise<void> => {
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
	const stopPlaying = async (): Promise<void> => {
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
