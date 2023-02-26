import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { useWorkerContext } from '../../AppContexts/Worker';
import { Button, ButtonProps } from '../../Controls/Button';
import { createPlayer } from '../../SoundProcessing/Player';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';
import { useLazyMemoAsync } from '../../UtilsReact/LazyMemo';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
	isRecording, isPlaying, setIsPlaying, soundBufferManager,
}: SoundWorkshopSnapshot) => ({
	isRecording, isPlaying, setIsPlaying, soundBufferManager,
} as const);

export const SoundPlayerButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { isRecording, isPlaying, setIsPlaying, soundBufferManager } = store;

	const { PlayIcon, StopIcon } = useIconContext();
	const { i18n } = useLocaleContext();
	const { playerUrl } = useWorkerContext();

	const getPlayer = useLazyMemoAsync(async () => {
		const { soundBuffer, cursor } = soundBufferManager;
		const { channelCount } = soundBuffer;
		const player = await createPlayer(playerUrl, channelCount, {
			onStarted: () => {
				setIsPlaying(true);
			},
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
	};
	const stopPlaying = async (): Promise<void> => {
		const player = await getPlayer();
		await player.stop();
	};
	const buttonProps: ButtonProps = {
		kind: 'icon',
		disabled: isRecording,
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
