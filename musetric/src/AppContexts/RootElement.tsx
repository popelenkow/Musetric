import React, { useContext, useState, createContext, FC } from 'react';

export type RootElementStore = {
	rootElement: HTMLElement;
	setRootElement: (element: HTMLElement) => void;
};
// eslint-disable-next-line
const defaultRootElementStore: RootElementStore = undefined as any;
export const RootElementContext = createContext<RootElementStore>(defaultRootElementStore);

export const RootElementConsumer = RootElementContext.Consumer;

export type RootElementProviderProps = {
	initRootElement?: HTMLElement;
};

export const RootElementProvider: FC<RootElementProviderProps> = (props) => {
	const { children, initRootElement } = props;

	const [rootElement, setRootElement] = useState<HTMLElement>(initRootElement || document.body);

	const store: RootElementStore = {
		rootElement, setRootElement,
	};

	return (
		<RootElementContext.Provider value={store}>
			{children}
		</RootElementContext.Provider>
	);
};

export const useRootElementContext = () => useContext(RootElementContext);
