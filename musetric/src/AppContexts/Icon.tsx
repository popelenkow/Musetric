import React, { useContext, FC } from 'react';
import { Icons } from '../AppBase/Icon';
import { createContext } from './Context';

export type IconStore = Icons;
export const IconContext = createContext<IconStore>();

export type IconProviderProps = {
	icons: Icons;
};
export const IconProvider: FC<IconProviderProps> = (props) => {
	const { children, icons } = props;

	const store: IconStore = icons;

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};

export const useIconContext = (): IconStore => useContext(IconContext);
