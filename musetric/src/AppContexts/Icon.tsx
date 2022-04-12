import React, { FC, useContext } from 'react';
import { Icons } from '../AppBase/Icon';
import { WithChildren } from '../Controls/utils';
import { createContext } from './Context';

export type IconStore = Icons;
export const IconContext = createContext<IconStore>();

export type IconProviderProps = {
	icons: Icons;
};
export const IconProvider: FC<WithChildren<IconProviderProps>> = (props) => {
	const { children, icons } = props;

	const store: IconStore = icons;

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};

export const useIconContext = (): IconStore => useContext(IconContext);
