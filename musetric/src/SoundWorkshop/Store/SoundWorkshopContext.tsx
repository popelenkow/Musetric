import React, { createContext, useState, useEffect } from 'react';
import { useWorkerContext } from '../../AppContexts';
import { NumberRange } from '../../Rendering';
import { createRecorder, Recorder } from '../../SoundProcessing';
import { createSoundBufferManager, SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { ChildrenProps, SFC } from '../../UtilityTypes';
import { ContextStore, createStore, SetStoreState, useContextStore } from './useStore';

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

const createActions = (
	recorderUrl: string | URL,
	setState: SetStoreState<SoundWorkshopState>,
	getState: () => SoundWorkshopState,
) => ({
	setIsLive: (isLive: boolean) => setState((state) => {
		state.isLive = isLive;
	}),
	setIsPlaying: (isPlaying: boolean) => setState((state) => {
		state.isPlaying = isPlaying;
	}),
	setIsRecording: (isRecording: boolean) => setState((state) => {
		state.isRecording = isRecording;
	}),
	setSoundViewId: (soundViewId: SoundViewId) => setState((state) => {
		state.soundViewId = soundViewId;
	}),
	setIsOpenParameters: (isOpenParameters: boolean) => setState((state) => {
		state.isOpenParameters = isOpenParameters;
	}),
	setSoundParameters: (soundParameters: Partial<SoundParameters>) => setState((state) => {
		state.soundParameters = {
			...state.soundParameters,
			...soundParameters,
		};
	}),
	getRecorder: async (): Promise<Recorder> => {
		const snapshot = getState();
		if (snapshot.recorder) return snapshot.recorder;
		const { soundBufferManager } = snapshot;
		const { channelCount } = soundBufferManager.soundBuffer;
		const recorder = await createRecorder(recorderUrl, channelCount, {
			onProcess: (event): void => {
				const { chunk } = event;
				soundBufferManager.push(chunk, event.isRecording ? 'recording' : 'live');
			},
		});
		setState((state) => {
			state.recorder = recorder;
		});
		return recorder;
	},
} as const);
type Actions = ReturnType<typeof createActions>;
export type SoundWorkshopSnapshot = SoundWorkshopState & Actions;
type Store = ContextStore<SoundWorkshopSnapshot>;

export const SoundWorkshopContext = createContext<Store | undefined>(undefined);

export const SoundWorkshopProvider: SFC<ChildrenProps> = (props) => {
	const { children } = props;

	const { recorderUrl } = useWorkerContext();

	const [store, setStore] = useState<Store>();
	useEffect(() => {
		const currentStore = createStore(initialState, (setState, getState) => (
			createActions(recorderUrl, setState, getState)
		));
		setStore(currentStore);
		return () => {
			const snapshot = currentStore.getSnapshot();
			snapshot.recorder?.destroy();
		};
	}, [recorderUrl]);

	return (
		<SoundWorkshopContext.Provider value={store}>
			{store && children}
		</SoundWorkshopContext.Provider>
	);
};

export const useSoundWorkshopStore = <R,>(selector: (store: SoundWorkshopSnapshot) => R): R => (
	useContextStore(SoundWorkshopContext, 'useSoundWorkshopContext', selector)
);
