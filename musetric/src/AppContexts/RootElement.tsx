import React, { createContext, FC, useState, useMemo } from 'react';
import { WithChildren } from '../ReactUtils/WithChildren';
import { useInitializedContext } from '../ReactUtils/Context';

export type RootElementStore = {
	rootElement: HTMLElement;
	setRootElement: (element: HTMLElement) => void;
};
export const RootElementContext = createContext<RootElementStore | undefined>(undefined);

export const RootElementConsumer = RootElementContext.Consumer;

export type RootElementProviderProps = {
	initRootElement?: HTMLElement;
};

export const RootElementProvider: FC<WithChildren<RootElementProviderProps>> = (props) => {
	const { children, initRootElement } = props;

	const initElement = initRootElement || document.body;
	const [rootElement, setRootElement] = useState<HTMLElement>(initElement);

	const store: RootElementStore = useMemo(() => ({
		rootElement, setRootElement,
	}), [rootElement]);

	return (
		<RootElementContext.Provider value={store}>
			{children}
		</RootElementContext.Provider>
	);
};

export const useRootElementContext = (): RootElementStore => useInitializedContext(RootElementContext, 'useRootElementContext');
