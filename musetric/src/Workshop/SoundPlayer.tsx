import React, { useState, useMemo, FC } from 'react';
import { SoundBuffer } from '../Sounds';
import { useIconContext } from '../AppContexts/Icon';
import { Button } from '../Controls/Button';
import { useAnimation } from '../RenderingComponents/Animation';

export const useSoundPlayer = (soundBuffer: SoundBuffer, soundBlob?: Blob) => {
	const { PlayIcon, StopIcon } = useIconContext();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const player = useMemo(() => {
		if (!soundBlob) return undefined;
		const url = URL.createObjectURL(soundBlob);
		const element = document.createElement('audio');
		element.src = url;
		element.onended = () => {
			setIsPlaying(false);
			soundBuffer.setCursor(0);
		};
		const { cursor, sampleRate } = soundBuffer;
		element.currentTime = cursor / sampleRate;
		return {
			prevCursor: soundBuffer.cursor,
			element,
		};
	}, [soundBlob, soundBuffer]);

	useAnimation(() => {
		if (!player) return;
		if (!isPlaying) return;
		const { sampleRate, cursor } = soundBuffer;
		const { element, prevCursor } = player;
		if (prevCursor !== cursor) {
			element.currentTime = cursor / sampleRate;
		} else {
			const value = Math.floor(element.currentTime * sampleRate);
			soundBuffer.setCursor(value);
		}
		player.prevCursor = soundBuffer.cursor;
	}, [player, soundBuffer, isPlaying]);

	const startPlaying = async () => {
		await player?.element?.play();
		setIsPlaying(true);
	};

	const stopPlaying = () => {
		player?.element?.pause();
		setIsPlaying(false);
	};

	type PlayerButtonProps = {
		disabled: boolean;
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
