import React, { createContext, ReactElement, ReactNode } from 'react';
import { Icons } from '../AppBase/Icon';
import { useInitializedContext } from '../ReactUtils/Context';

export type IconStore = Icons;
export const IconContext = createContext<IconStore | undefined>(undefined);

export type IconProviderProps = {
	icons: Icons,
};
export function IconProvider(
	props: IconProviderProps & { children: ReactNode },
): ReactElement {
	const { children, icons } = props;

	const store: IconStore = icons;

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
}

export const useIconContext = (): IconStore => useInitializedContext(IconContext, 'useIconContext');
