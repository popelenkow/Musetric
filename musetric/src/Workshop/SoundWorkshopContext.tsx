import React, { FC, useMemo, createContext, useReducer, Dispatch } from 'react';
import { WithChildren } from '../ReactUtils/WithChildren';
import { useInitializedContext } from '../ReactUtils/Context';

export type SoundViewId = 'Waveform' | 'Frequency' | 'Spectrogram';
export type SoundWorkshopState = {
	isLive: boolean;
	soundViewId: SoundViewId;
	isOpenParameters: boolean;
};
const initialState: SoundWorkshopState = {
	isLive: false,
	soundViewId: 'Waveform',
	isOpenParameters: false,
};

export type SoundWorkshopAction = (
	| { type: 'setIsLive'; isLive: boolean }
	| { type: 'setSoundViewId'; soundViewId: SoundViewId }
	| { type: 'setIsOpenParameters'; isOpenParameters: boolean }
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
		case 'setSoundViewId': {
			const { soundViewId } = action;
			return { ...state, soundViewId };
		}
		case 'setIsOpenParameters': {
			const { isOpenParameters } = action;
			return { ...state, isOpenParameters };
		}
		default: {
			throw new Error(`Sound workshop does not support event type: ${actionType}`);
		}
	}
};

export type SoundWorkshopStore = [SoundWorkshopState, Dispatch<SoundWorkshopAction>];
export const SoundWorkshopContext = createContext<SoundWorkshopStore | undefined>(undefined);

export type SoundWorkshopProviderProps = object;
export const SoundWorkshopProvider: FC<WithChildren<SoundWorkshopProviderProps>> = (props) => {
	const { children } = props;

	const [state, dispatch] = useReducer(soundWorkshopReducer, initialState);
	const store: SoundWorkshopStore = useMemo(() => [state, dispatch], [state]);

	return (
		<SoundWorkshopContext.Provider value={store}>
			{children}
		</SoundWorkshopContext.Provider>
	);
};

export const useSoundWorkshopContext = (): SoundWorkshopStore => (
	useInitializedContext(SoundWorkshopContext, 'useSoundWorkshopContext')
);
