import React from 'react';

export type AppElementStore = {
	appElement: HTMLElement;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppElementContext = React.createContext<AppElementStore>({} as any);

export const AppElementConsumer = AppElementContext.Consumer;

export type AppElementProviderProps = {
	appElement?: HTMLElement | null;
};

export const AppElementProvider: React.FC<AppElementProviderProps> = (props) => {
	const { children, appElement } = props;

	const store: AppElementStore = {
		appElement: appElement || document.body,
	};

	return (
		<AppElementContext.Provider value={store}>
			{children}
		</AppElementContext.Provider>
	);
};
