import React, { useContext, createContext, FC } from 'react';
import { Icons } from '../AppBase/Icon';

export type IconStore = Icons;
// eslint-disable-next-line
const defaultIconStore: IconStore = undefined as any;
export const IconContext = createContext<IconStore>(defaultIconStore);

export type IconProviderProps = {
	icons: Icons;
};
export const IconProvider: FC<IconProviderProps> = (props) => {
	const { children, icons } = props;

	const store: IconStore = { ...icons };

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};

export const useIconContext = (): IconStore => useContext(IconContext);
