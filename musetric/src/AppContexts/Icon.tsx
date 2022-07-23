import React, { createContext, FC } from 'react';
import { Icons } from '../AppBase/Icon';
import { WithChildren } from '../ReactUtils/WithChildren';
import { useInitializedContext } from '../ReactUtils/Context';

export type IconStore = Icons;
export const IconContext = createContext<IconStore | undefined>(undefined);

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

export const useIconContext = (): IconStore => useInitializedContext(IconContext, 'useIconContext');
