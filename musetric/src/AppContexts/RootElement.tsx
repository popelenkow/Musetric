import React, { createContext, useState, useMemo, ReactNode, ReactElement } from 'react';
import { useInitializedContext } from '../ReactUtils/Context';

export type RootElementStore = {
	rootElement: HTMLElement,
	setRootElement: (element: HTMLElement) => void,
};
export const RootElementContext = createContext<RootElementStore | undefined>(undefined);

export const RootElementConsumer = RootElementContext.Consumer;

export type RootElementProviderProps = {
	initRootElement?: HTMLElement,
};

export function RootElementProvider(
	props: RootElementProviderProps & { children: ReactNode },
): ReactElement {
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
}

export const useRootElementContext = (): RootElementStore => useInitializedContext(RootElementContext, 'useRootElementContext');
