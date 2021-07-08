import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Classes } from 'jss';
import { JssProvider, createTheming, createUseStyles, Styles } from 'react-jss';
import { Theme, Platform, getPlatformId } from '..';

export type AppCss = {
	theme: Theme;
	platform: Platform;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemingContext = React.createContext<AppCss>({} as any);
export const theming = createTheming(ThemingContext);

export const createUseClasses = <C extends string = string, Props = unknown>(
	name: string,
	styles: Styles<C, Props, AppCss> | ((theme: AppCss) => Styles<C, Props, undefined>),
): (data?: Props & { theme?: AppCss }) => Classes<C> => {
	return createUseStyles(styles, { name, theming });
};

export type AppCssStore = {
	css: AppCss;
	themeId: string;
	setThemeId: (id: string) => void;
	allThemeIds: string[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppCssContext = React.createContext<AppCssStore>({} as any);
export const AppCssConsumer = AppCssContext.Consumer;

const usePlatform = (): Platform => {
	const platformId = useMemo(() => getPlatformId(), []);
	const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);

	useEffect(() => {
		const resize = () => {
			setInnerHeight(window.innerHeight);
		};

		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [platformId]);

	const platform: Platform = platformId === 'mobile' ? {
		id: 'mobile',
		height: `${innerHeight}px`,
		width: '100vw',
	} : {
		id: 'desktop',
		height: '100vh',
		width: '100vw',
	};
	return platform;
};

export type AppCssProviderProps = {
	initThemeId?: string;
	allThemeIds: string[];
	allThemes: Record<string, Theme>;
	onSetThemeId?: (themeId: string) => void;
};
export const AppCssProvider: React.FC<AppCssProviderProps> = (props) => {
	const { children, initThemeId, allThemeIds, allThemes, onSetThemeId } = props;

	const [themeId, setThemeId] = useState<string>(initThemeId || allThemeIds[0]);
	const theme = allThemes[themeId];
	const platform = usePlatform();

	const value: AppCssStore = {
		css: { theme, platform },
		themeId,
		setThemeId: (id: string) => {
			setThemeId(id);
			onSetThemeId && onSetThemeId(id);
		},
		allThemeIds,
	};

	return (
		<AppCssContext.Provider value={value}>
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				<theming.ThemeProvider theme={{ theme, platform }}>
					{children}
				</theming.ThemeProvider>
			</JssProvider>
		</AppCssContext.Provider>
	);
};

export const useAppCssContext = () => useContext(AppCssContext);
