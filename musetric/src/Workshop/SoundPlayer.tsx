import React, { useState, FC } from 'react';
import { SoundBuffer } from '../Sounds';
import { useIconContext } from '../AppContexts/Icon';
import { Button } from '../Controls/Button';
import { useCacheAsync } from '../Hooks/Cache';
import { createPlayer } from '../SoundProcessing/Player';
import { useWorkerContext } from '../AppContexts/Worker';

export type PlayerButtonProps = {
	disabled: boolean;
};
export type SoundPlayer = {
	isPlaying: boolean;
	PlayerButton: FC<PlayerButtonProps>;
};
export const useSoundPlayer = (soundBuffer: SoundBuffer): SoundPlayer => {
	const { PlayIcon, StopIcon } = useIconContext();
	const { playerUrl } = useWorkerContext();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [getPlayer] = useCacheAsync(async () => {
		const { channelCount } = soundBuffer;
		const player = await createPlayer(playerUrl, channelCount);
		player.onStopped = (reset) => {
			setIsPlaying(false);
			if (reset) soundBuffer.cursor.set(0, 'process');
		};
		player.onCursor = (value) => {
			soundBuffer.cursor.set(value, 'process');
		};
		soundBuffer.cursor.on.subscribe(async (event) => {
			const { inputType, value } = event;
			if (inputType === 'user') await player.setCursor(value);
		});
		return player;
	}, [soundBuffer, playerUrl]);

	const startPlaying = async () => {
		const { buffers, cursor } = soundBuffer;
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

	const PlayerButton: FC<PlayerButtonProps> = (props) => {
		const { disabled } = props;
		return !isPlaying
			? <Button disabled={disabled} onClick={startPlaying}><PlayIcon /></Button>
			: <Button onClick={stopPlaying}><StopIcon /></Button>;
	};

	return {
		isPlaying,
		PlayerButton,
	};
};
