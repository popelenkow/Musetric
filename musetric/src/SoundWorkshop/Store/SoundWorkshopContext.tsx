import { produce } from 'immer';
import React, { createContext, useState, useEffect } from 'react';
import { useWorkerContext } from '../../AppContexts';
import { NumberRange } from '../../Rendering';
import { createRecorder, Recorder } from '../../SoundProcessing';
import { createSoundBufferManager, SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { ChildrenProps, SFC } from '../../UtilityTypes';
import { useContextStore } from './useStore';

export type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';

export type SoundParameters = {
	frequencyRange: NumberRange,
	sampleRate: number,
};
export type SoundWorkshopState = {
	isLive: boolean,
	isPlaying: boolean,
	isRecording: boolean,
	soundViewId: SoundViewId,
	isOpenParameters: boolean,
	soundParameters: SoundParameters,
	soundBufferManager: SoundBufferManager,
	recorder?: Recorder,
};
const initialValues = {
	sampleRate: 48000,
	channelCount: 2,
};
const initialState: SoundWorkshopState = {
	isLive: false,
	isPlaying: false,
	isRecording: false,
	soundViewId: 'Waveform',
	isOpenParameters: false,
	soundParameters: {
		frequencyRange: { from: 0, to: initialValues.sampleRate / 12 },
		sampleRate: initialValues.sampleRate,
	},
	soundBufferManager: createSoundBufferManager(
		initialValues.sampleRate,
		initialValues.channelCount,
	),
};

type SetState = (callback: (state: SoundWorkshopState) => SoundWorkshopState | void) => void;
const createActions = (setState: SetState) => ({
	setIsLive: (isLive: boolean): void => setState((state) => {
		state.isLive = isLive;
	}),
	setIsPlaying: (isPlaying: boolean): void => setState((state) => {
		state.isPlaying = isPlaying;
	}),
	setIsRecording: (isRecording: boolean): void => setState((state) => {
		state.isRecording = isRecording;
	}),
	setSoundViewId: (soundViewId: SoundViewId): void => setState((state) => {
		state.soundViewId = soundViewId;
	}),
	setIsOpenParameters: (isOpenParameters: boolean): void => setState((state) => {
		state.isOpenParameters = isOpenParameters;
	}),
	setSoundParameters: (soundParameters: Partial<SoundParameters>): void => setState((state) => {
		state.soundParameters = {
			...state.soundParameters,
			...soundParameters,
		};
	}),
	setRecorder: (recorder: Recorder): void => setState((state) => {
		state.recorder = recorder;
	}),
} as const);
export type SoundWorkshopStore = SoundWorkshopState & ReturnType<typeof createActions> & {
	getRecorder: () => Promise<Recorder>,
};

type Callback = () => void;
export type MyStore = {
	subscribe: (callback: Callback) => Callback,
	getSnapshot: () => SoundWorkshopStore,
	destroy: () => void,
};
const createStore = (recorderUrl: string | URL): MyStore => {
	const subscriptions = new Set<Callback>();
	// eslint-disable-next-line
	let snapshot: SoundWorkshopStore = {
		...initialState,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;

	const setState = (callback: (state: SoundWorkshopState) => SoundWorkshopState | void): void => {
		snapshot = produce(snapshot, callback);
		subscriptions.forEach((x) => x());
	};
	const actions = createActions(setState);
	const getRecorder = async (): Promise<Recorder> => {
		if (snapshot.recorder) return snapshot.recorder;
		const { soundBufferManager } = snapshot;
		const { channelCount } = soundBufferManager.soundBuffer;
		const recorder = await createRecorder(recorderUrl, channelCount, {
			onProcess: (event): void => {
				const { chunk } = event;
				soundBufferManager.push(chunk, event.isRecording ? 'recording' : 'live');
			},
		});
		actions.setRecorder(recorder);
		return recorder;
	};
	snapshot = {
		...snapshot,
		...actions,
		getRecorder,
	};
	return {
		subscribe: (callback: Callback): Callback => {
			subscriptions.add(callback);
			return (): void => {
				subscriptions.delete(callback);
			};
		},
		getSnapshot: () => snapshot,
		destroy: (): void => {
			snapshot.recorder?.destroy();
		},
	};
};

export const SoundWorkshopContext = createContext<MyStore | undefined>(undefined);

export const SoundWorkshopProvider: SFC<ChildrenProps> = (props) => {
	const { children } = props;

	const { recorderUrl } = useWorkerContext();

	const [store, setStore] = useState<MyStore>();
	useEffect(() => {
		const currentStore = createStore(recorderUrl);
		setStore(currentStore);
		return () => {
			currentStore.destroy();
		};
	}, [recorderUrl]);

	return (
		<SoundWorkshopContext.Provider value={store}>
			{store && children}
		</SoundWorkshopContext.Provider>
	);
};

export const useSoundWorkshopStore = <R,>(selector: (store: SoundWorkshopStore) => R): R => (
	useContextStore(SoundWorkshopContext, 'useSoundWorkshopContext', selector)
);
