import React, { useMemo, createContext, useReducer, Dispatch, useRef, useEffect } from 'react';
import { useWorkerContext } from '../../AppContexts';
import { useInitializedContext } from '../../ReactUtils';
import { NumberRange } from '../../Rendering';
import { createRecorder, Recorder } from '../../SoundProcessing';
import { createSoundBufferManager, SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { ChildrenProps, SFC } from '../../UtilityTypes';

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

export type SoundWorkshopAction = (
	| { type: 'setIsLive', isLive: boolean }
	| { type: 'setIsPlaying', isPlaying: boolean }
	| { type: 'setIsRecording', isRecording: boolean }
	| { type: 'setSoundViewId', soundViewId: SoundViewId }
	| { type: 'setIsOpenParameters', isOpenParameters: boolean }
	| { type: 'setSoundParameters', soundParameters: SoundParameters }
	| { type: 'setRecorder', recorder: Recorder }
);
export const soundWorkshopReducer = (
	state: SoundWorkshopState,
	action: SoundWorkshopAction,
): SoundWorkshopState => {
	const actionType = action.type;
	switch (action.type) {
		case 'setIsLive': {
			const { isLive } = action;
			return { ...state, isLive };
		}
		case 'setIsPlaying': {
			const { isPlaying } = action;
			return { ...state, isPlaying };
		}
		case 'setIsRecording': {
			const { isRecording } = action;
			return { ...state, isRecording };
		}
		case 'setSoundViewId': {
			const { soundViewId } = action;
			return { ...state, soundViewId };
		}
		case 'setIsOpenParameters': {
			const { isOpenParameters } = action;
			return { ...state, isOpenParameters };
		}
		case 'setSoundParameters': {
			const { soundParameters } = action;
			return { ...state, soundParameters };
		}
		case 'setRecorder': {
			const { recorder } = action;
			return { ...state, recorder };
		}
		default: {
			throw new Error(`Sound workshop does not support event type: ${actionType}`);
		}
	}
};

export type SoundWorkshopStore = SoundWorkshopState & {
	dispatch: Dispatch<SoundWorkshopAction>,
	getRecorder: () => Promise<Recorder>,
};
export const SoundWorkshopContext = createContext<SoundWorkshopStore | undefined>(undefined);

export const SoundWorkshopProvider: SFC<ChildrenProps> = (props) => {
	const { children } = props;

	const recorderRef = useRef<Recorder>();
	const { recorderUrl } = useWorkerContext();

	const [state, dispatch] = useReducer(soundWorkshopReducer, initialState);
	const store = useMemo<SoundWorkshopStore>(() => {
		const getRecorder = async (): Promise<Recorder> => {
			if (recorderRef.current) return recorderRef.current;
			const { soundBufferManager } = state;
			const { channelCount } = soundBufferManager.soundBuffer;
			recorderRef.current = await createRecorder(recorderUrl, channelCount, {
				onProcess: (event): void => {
					const { chunk } = event;
					soundBufferManager.push(chunk, event.isRecording ? 'recording' : 'live');
				},
			});
			return recorderRef.current;
		};
		return {
			...state,
			dispatch,
			getRecorder,
		};
	}, [state, dispatch, recorderUrl]);

	useEffect(() => {
		return () => {
			const recorder = recorderRef.current;
			if (!recorder) return;
			recorder.destroy();
		};
	}, []);

	return (
		<SoundWorkshopContext.Provider value={store}>
			{children}
		</SoundWorkshopContext.Provider>
	);
};
SoundWorkshopProvider.displayName = 'SoundWorkshopProvider';

export const useSoundWorkshopStore = (): SoundWorkshopStore => (
	useInitializedContext(SoundWorkshopContext, 'useSoundWorkshopContext')
);
