import React, { Dispatch, SetStateAction, useState } from 'react';

export type AppElementStore = {
	appElement: HTMLElement; setAppElement: Dispatch<SetStateAction<HTMLElement>>;
	setModalDialog: (modal?: React.ReactNode) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppElementContext = React.createContext<AppElementStore>({} as any);

export const AppElementConsumer = AppElementContext.Consumer;

export type AppElementProviderProps = {
	initAppElement: HTMLElement;
	setModalDialog: (modal?: React.ReactNode) => void;
};

export const AppElementProvider: React.FC<AppElementProviderProps> = (props) => {
	const { children, initAppElement, setModalDialog } = props;

	const [appElement, setAppElement] = useState<HTMLElement>(initAppElement);

	const store: AppElementStore = {
		appElement, setAppElement, setModalDialog,
	};

	return (
		<AppElementContext.Provider value={store}>
			{children}
		</AppElementContext.Provider>
	);
};
