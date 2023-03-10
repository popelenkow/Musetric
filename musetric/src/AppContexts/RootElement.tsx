import React, { createContext, useState, useMemo } from 'react';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';

export type RootElementStore = {
	rootElement: HTMLElement,
	setRootElement: (element: HTMLElement) => void,
};
export const RootElementContext = createContext<RootElementStore | undefined>(undefined);

export const RootElementConsumer = RootElementContext.Consumer;

export type RootElementProviderProps = {
	initRootElement?: HTMLElement,
};

export const RootElementProvider: SFC<RootElementProviderProps, { children: 'required' }> = (props) => {
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
