import React, { Dispatch, SetStateAction, useState } from 'react';
import { JssProvider, createTheming } from 'react-jss';
import { Theme } from '..';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemingContext = React.createContext<Theme>({} as any);
export const theming = createTheming(ThemingContext);
export const { useTheme } = theming;

export type ThemeStore = {
	themeId: string;
	setThemeId: Dispatch<SetStateAction<string>>;
	themeIdList: string[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeContext = React.createContext<ThemeStore>({} as any);
export const ThemeConsumer = ThemeContext.Consumer;

export type ThemeProviderProps = {
	initThemeId?: string;
	themeIdList: string[];
	allThemes: Record<string, Theme>;
};
export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
	const { children, initThemeId, themeIdList, allThemes } = props;

	const [themeId, setThemeId] = useState<string>(initThemeId || themeIdList[0]);

	const value: ThemeStore = {
		themeId,
		setThemeId,
		themeIdList,
	};

	return (
		<ThemeContext.Provider value={value}>
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				<theming.ThemeProvider theme={allThemes[themeId]}>
					{children}
				</theming.ThemeProvider>
			</JssProvider>
		</ThemeContext.Provider>
	);
};
