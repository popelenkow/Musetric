import React, { FC, useContext, useState, useMemo } from 'react';
import { WithChildren } from '../Controls/utils';
import { createContext } from './Context';

export type RootElementStore = {
	rootElement: HTMLElement;
	setRootElement: (element: HTMLElement) => void;
};
export const RootElementContext = createContext<RootElementStore>();

export const RootElementConsumer = RootElementContext.Consumer;

export type RootElementProviderProps = {
	initRootElement?: HTMLElement;
};

export const RootElementProvider: FC<WithChildren<RootElementProviderProps>> = (props) => {
	const { children, initRootElement } = props;

	const [rootElement, setRootElement] = useState<HTMLElement>(initRootElement || document.body);

	const store: RootElementStore = useMemo(() => ({
		rootElement, setRootElement,
	}), [rootElement]);

	return (
		<RootElementContext.Provider value={store}>
			{children}
		</RootElementContext.Provider>
	);
};

export const useRootElementContext = (): RootElementStore => useContext(RootElementContext);
