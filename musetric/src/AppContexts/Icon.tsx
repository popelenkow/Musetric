import React, { createContext } from 'react';
import { Icons } from '../AppBase/Icon';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';

export type IconStore = Icons;
export const IconContext = createContext<IconStore | undefined>(undefined);

export type IconProviderProps = {
	icons: Icons,
};
export const IconProvider: SFC<IconProviderProps, { children: 'required' }> = (props) => {
	const { children, icons } = props;

	const store: IconStore = icons;

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};

export const useIconContext = (): IconStore => useInitializedContext(IconContext, 'useIconContext');
