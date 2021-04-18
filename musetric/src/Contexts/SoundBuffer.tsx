import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { SoundBuffer, createSoundBuffer, createSoundFixedQueue, createWavCoder, Recorder, createRecorder, useAnimation } from '..';

export type SoundBufferStore = {
	sound: {
		buffer: SoundBuffer;
		fixedQueue: SoundBuffer;
	},
	isLive: boolean;
	setIsLive: (value: boolean) => Promise<void>;
	file: {
		set: (file: File) => Promise<void>;
		save: (fileName: string) => void;
	},
	recorder: {
		isRecording: boolean;
		start: () => Promise<void>;
		stop: () => Promise<void>;
	},
	player: {
		isPlaying: boolean;
		start: () => Promise<void>;
		stop: () => void;
	},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SoundBufferContext = React.createContext<SoundBufferStore>({} as any);

export const SoundBufferConsumer = SoundBufferContext.Consumer;

const useFile = (soundBuffer: SoundBuffer, setSoundBlob: (blob: Blob) => void) => {
	const [audioContextState, setAudioContext] = useState<AudioContext>();
	const getAudioContext = () => {
		const { sampleRate } = soundBuffer;
		let audioContext = audioContextState;
		if (!audioContext) {
			audioContext = new AudioContext({ sampleRate });
			setAudioContext(audioContext);
		}

		const audioBufferSource = audioContext.createBufferSource();
		audioBufferSource.buffer;
		return audioContext;
	};
	const wavCoder = useMemo(() => createWavCoder(), []);

	const getBlob = useCallback(async (): Promise<Blob> => {
		const { buffers, sampleRate } = soundBuffer;
		const blob = await wavCoder.encode({ buffers, sampleRate });
		return blob;
	}, [soundBuffer, wavCoder]);

	useEffect(() => {
		getBlob().then(blob => {
			setSoundBlob(blob);
		}).finally(() => {});
	}, [getBlob, setSoundBlob]);

	return {
		getBlob,
		set: async (file: File) => {
			const audioContext = getAudioContext();
			const arrayBuffer = await file.arrayBuffer();
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
			const buffers: Float32Array[] = [];
			for (let i = 0; i < soundBuffer.channelCount; i++) {
				buffers[i] = audioBuffer.getChannelData(i);
			}
			soundBuffer.push(buffers);
			const blob = await getBlob();
			setSoundBlob(blob);
		},
		save: async (name: string) => {
			const blob = await getBlob();
			saveAs(blob, name);
		},
	};
};

const useRecorder = (
	soundBuffer: SoundBuffer,
	soundFixedQueue: SoundBuffer,
	getBlob: () => Promise<Blob>,
	setSoundBlob: (blob: Blob) => void,
) => {
	const [recorderState, setRecorder] = useState<Recorder>();
	const getRecorder = async () => {
		let recorder = recorderState;
		if (!recorder) {
			const audioContext = new AudioContext();

			const onChunk = (chunk: Float32Array[], isRecording: boolean): void => {
				isRecording && soundBuffer.push(chunk);
				soundFixedQueue.push(chunk);
			};
			const { channelCount } = soundBuffer;
			recorder = await createRecorder({ audioContext, channelCount, onChunk });
			setRecorder(recorder);
		}
		return recorder;
	};

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const start = async () => {
		const recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};

	const stop = async () => {
		const recorder = await getRecorder();
		await recorder.stop();
		const blob = await getBlob();
		setSoundBlob(blob);
		setIsRecording(false);
	};

	return {
		isRecording,
		getRecorder,
		start,
		stop,
	};
};

const usePlayer = (soundBuffer: SoundBuffer, soundBlob?: Blob) => {
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

	const start = async () => {
		await player?.element?.play();
		setIsPlaying(true);
	};

	const stop = () => {
		player?.element?.pause();
		setIsPlaying(false);
	};

	return {
		isPlaying,
		start,
		stop,
	};
};

export type SoundBufferProviderProps = {
};

export const SoundBufferProvider: React.FC<SoundBufferProviderProps> = (props) => {
	const { children } = props;

	const sound = useMemo(() => ({
		buffer: createSoundBuffer(48000, 2),
		fixedQueue: createSoundFixedQueue(48000, 2),
	}), []);
	const [soundBlob, setSoundBlob] = useState<Blob>();
	const [isLive, setIsLive] = useState<boolean>(false);
	const file = useFile(sound.buffer, setSoundBlob);
	const recorder = useRecorder(sound.buffer, sound.fixedQueue, file.getBlob, setSoundBlob);
	const player = usePlayer(sound.buffer, soundBlob);

	const store: SoundBufferStore = {
		sound,
		isLive,
		setIsLive: async (value) => {
			await recorder.getRecorder();
			setIsLive(value);
		},
		file,
		recorder,
		player,
	};

	return (
		<SoundBufferContext.Provider value={store}>
			{children}
		</SoundBufferContext.Provider>
	);
};

export const useSoundBuffer = () => useContext(SoundBufferContext);
