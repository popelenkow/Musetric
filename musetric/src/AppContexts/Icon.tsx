import React, { createContext } from 'react';
import { Icons } from '../AppBase/Icon';
import { useInitializedContext } from '../ReactUtils/Context';
import { SFC } from '../UtilityTypes';

export type IconStore = Icons;
export const IconContext = createContext<IconStore | undefined>(undefined);

export type IconProviderProps = {
	icons: Icons,
};
export const IconProvider: SFC<IconProviderProps, 'required'> = (props) => {
	const { children, icons } = props;

	const store: IconStore = icons;

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};
IconProvider.displayName = 'IconProvider';

export const useIconContext = (): IconStore => useInitializedContext(IconContext, 'useIconContext');
