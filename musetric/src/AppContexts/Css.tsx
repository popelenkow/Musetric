import React, { useState, useEffect, useContext, useMemo, createContext, FC } from 'react';
import { Classes } from 'jss';
import { JssProvider, createTheming, createUseStyles, Styles } from 'react-jss';
import { Platform, getPlatformId } from '../AppBase/Platform';
import { Theme, ThemeEntry } from '../AppBase/Theme';

export type Css = {
	theme: Theme;
	platform: Platform;
};
const defaultCss: Css = {
	theme: {
		app: '',
		sidebar: '',
		content: '',
		disabled: '',
		hover: '',
		active: '',
		splitter: '',
	},
	platform: {
		platformId: 'desktop',
		height: '100vh',
		width: '100vw',
	},
};
export const ThemingContext = createContext<Css>(defaultCss);
export const theming = createTheming(ThemingContext);

export const createUseClasses = <C extends string = string, Props = unknown>(
	name: string,
	styles: Styles<C, Props, Css> | ((theme: Css) => Styles<C, Props, undefined>),
): (data?: Props & { theme?: Css }) => Classes<C> => {
	return createUseStyles(styles, { name, theming });
};

export type CssStore = {
	css: Css;
	themeId: string;
	setThemeId: (id: string) => void;
	allThemeIds: string[];
};
const defaultLocaleStore: CssStore = {
	css: defaultCss,
	themeId: '',
	setThemeId: () => {},
	allThemeIds: [],
};
export const CssContext = createContext<CssStore>(defaultLocaleStore);
export const CssConsumer = CssContext.Consumer;

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
		platformId,
		height: `${innerHeight}px`,
		width: '100vw',
	} : {
		platformId,
		height: '100vh',
		width: '100vw',
	};
	return platform;
};

export type CssProviderProps = {
	initThemeId?: string;
	allThemeEntries: ThemeEntry[];
	onSetThemeId?: (themeId: string) => void;
};
export const CssProvider: FC<CssProviderProps> = (props) => {
	const { children, initThemeId, allThemeEntries, onSetThemeId } = props;

	const allThemeIds = allThemeEntries.map(x => x.themeId);
	const [themeId, setThemeId] = useState<string>(initThemeId || allThemeIds[0]);
	const themeEntry = allThemeEntries.find(x => x.themeId === themeId);
	const { theme = allThemeEntries[0].theme } = themeEntry || { };
	const platform = usePlatform();

	const value: CssStore = {
		css: { theme, platform },
		themeId,
		setThemeId: (id: string) => {
			setThemeId(id);
			onSetThemeId && onSetThemeId(id);
		},
		allThemeIds,
	};

	return (
		<CssContext.Provider value={value}>
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				<theming.ThemeProvider theme={{ theme, platform }}>
					{children}
				</theming.ThemeProvider>
			</JssProvider>
		</CssContext.Provider>
	);
};

export const useCssContext = () => useContext(CssContext);
