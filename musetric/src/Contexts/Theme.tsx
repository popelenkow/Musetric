import React, { Dispatch, SetStateAction, useState } from 'react';
import { JssProvider, createTheming } from 'react-jss';
import { Theme } from '../Themes';

export { Theme };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeContext = React.createContext<Theme>({} as any);
export const theming = createTheming(ThemeContext);
export const { ThemeProvider, useTheme } = theming;

export type Store = {
	themeId: string;
	setThemeId: Dispatch<SetStateAction<string>>;
	themeIdList: string[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Context = React.createContext<Store>({} as any);
export const { Consumer } = Context;

export type Props = {
	initThemeId?: string;
	themeIdList: string[];
	allThemes: Record<string, Theme>;
};
export const Provider: React.FC<Props> = (props) => {
	const { children, initThemeId, themeIdList, allThemes } = props;

	const [themeId, setThemeId] = useState<string>(initThemeId || themeIdList[0]);

	const value: Store = {
		themeId,
		setThemeId,
		themeIdList,
	};

	return (
		<Context.Provider value={value}>
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				<ThemeProvider theme={allThemes[themeId]}>
					{children}
				</ThemeProvider>
			</JssProvider>
		</Context.Provider>
	);
};
