import React, { useState, useEffect, useContext } from 'react';
import { JssProvider, createTheming } from 'react-jss';
import { ColorTheme, PlatformTheme, Theme, getPlatformId } from '..';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemingContext = React.createContext<Theme>({} as any);
export const theming = createTheming(ThemingContext);

export type ThemeStore = {
	theme: Theme;
	colorThemeId: string;
	setColorThemeId: (id: string) => void;
	allColorThemeIds: string[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeContext = React.createContext<ThemeStore>({} as any);
export const ThemeConsumer = ThemeContext.Consumer;

export type ThemeProviderProps = {
	initColorThemeId?: string;
	allColorThemeIds: string[];
	allColorThemes: Record<string, ColorTheme>;
};
export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
	const { children, initColorThemeId, allColorThemeIds, allColorThemes } = props;

	const platformId = getPlatformId();
	const [colorThemeId, setColorThemeId] = useState<string>(initColorThemeId || allColorThemeIds[0]);

	const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);

	useEffect(() => {
		const resize = () => {
			setInnerHeight(window.innerHeight);
		};

		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [platformId]);

	const color = allColorThemes[colorThemeId];
	const platform: PlatformTheme = platformId === 'mobile' ? {
		id: 'mobile',
		height: `${innerHeight}px`,
		width: '100vw',
	} : {
		id: 'desktop',
		height: '100vh',
		width: '100vw',
	};

	const value: ThemeStore = {
		theme: { color, platform },
		colorThemeId,
		setColorThemeId,
		allColorThemeIds,
	};

	return (
		<ThemeContext.Provider value={value}>
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				<theming.ThemeProvider theme={{ color, platform }}>
					{children}
				</theming.ThemeProvider>
			</JssProvider>
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
