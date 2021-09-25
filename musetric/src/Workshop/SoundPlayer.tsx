import React, { useState, FC } from 'react';
import { SoundBuffer } from '../Sounds';
import { useIconContext } from '../AppContexts/Icon';
import { Button } from '../Controls/Button';
import { useCache } from '../Hooks/Cache';
import { createPlayer } from '../SoundProcessing/Player';

export type PlayerButtonProps = {
	disabled: boolean;
};
export type SoundPlayer = {
	isPlaying: boolean;
	PlayerButton: FC<PlayerButtonProps>;
};
export const useSoundPlayer = (soundBuffer: SoundBuffer): SoundPlayer => {
	const { PlayIcon, StopIcon } = useIconContext();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [getPlayer] = useCache(() => {
		const { sampleRate, channelCount } = soundBuffer;
		return createPlayer({
			sampleRate,
			channelCount,
			onStopped: () => {
				setIsPlaying(false);
			},
		});
	}, [soundBuffer]);

	const startPlaying = () => {
		const player = getPlayer();
		player.start(soundBuffer);
		setIsPlaying(true);
	};

	const stopPlaying = () => {
		const player = getPlayer();
		player.stop();
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
