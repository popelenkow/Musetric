import React from 'react';

export type Store = {
	appElement: HTMLElement;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Context = React.createContext<Store>({} as any);

export const { Consumer } = Context;

export type Props = {
	appElement?: HTMLElement | null;
};

export const Provider: React.FC<Props> = (props) => {
	const { children, appElement } = props;

	const store: Store = {
		appElement: appElement || document.body,
	};

	return (
		<Context.Provider value={store}>
			{children}
		</Context.Provider>
	);
};
