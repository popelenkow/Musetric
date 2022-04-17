import React, { useState, useEffect, useContext, useMemo, FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Classes, GenerateId } from 'jss';
import { JssProvider, createTheming, createUseStyles, Styles } from 'react-jss';
import classNames from 'classnames';
import { Platform, getPlatformId } from '../AppBase/Platform';
import { Theme, ThemeEntry } from '../AppBase/Theme';
import { createContext } from './Context';
import { WithChildren } from '../Controls/utils';

export type Css = {
	theme: Theme;
	platform: Platform;
};
export const ThemingContext = createContext<Css>();
const theming = createTheming(ThemingContext);

export function createClasses<T>(create: (css: Css) => T): ((css: Css) => T) {
	return (css: Css) => create(css);
}
export const createUseClasses = <C extends string, Props>(
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
export const CssContext = createContext<CssStore>();

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
export const CssProvider: FC<WithChildren<CssProviderProps>> = (props) => {
	const { children, initThemeId, allThemeEntries, onSetThemeId } = props;

	const allThemeIds = allThemeEntries.map((x) => x.themeId);
	const [themeId, setThemeId] = useState<string>(initThemeId || allThemeIds[0]);
	const themeEntry = allThemeEntries.find((x) => x.themeId === themeId);
	const { theme = allThemeEntries[0].theme } = themeEntry || { };
	const platform = usePlatform();

	const value: CssStore = useMemo(() => ({
		css: { theme, platform },
		themeId,
		setThemeId: (id: string) => {
			setThemeId(id);
			if (onSetThemeId) onSetThemeId(id);
		},
		allThemeIds,
	}), [allThemeIds, onSetThemeId, platform, theme, themeId]);

	const generateId: GenerateId = (rule, sheet) => {
		const prefix = sheet?.options?.classNamePrefix || '';
		if (prefix && rule.key === 'root') return prefix.slice(0, prefix.length - 1);
		return `${prefix}${rule.key}`;
	};
	return (
		<CssContext.Provider value={value}>
			<JssProvider generateId={generateId}>
				<theming.ThemeProvider theme={{ theme, platform }}>
					{children}
				</theming.ThemeProvider>
			</JssProvider>
		</CssContext.Provider>
	);
};

export const useCssContext = (): CssStore => useContext(CssContext);

export type ClassNameArg = string | {
	value?: string | Record<string, boolean | undefined>;
	default?: string;
};
export const className = (...args: ClassNameArg[]) => {
	const resultArr = args.map<Record<string, boolean | undefined>>((arg) => {
		if (typeof arg === 'string') return { [arg]: true };
		if (!arg.value) return {};
		if (arg.value === arg.default) return {};
		if (typeof arg.value === 'object') return arg.value;
		return {
			[arg.value]: true,
		};
	});
	let resultObj = {};
	resultArr.forEach((obj) => {
		resultObj = { ...resultObj, ...obj };
	});
	return classNames(resultObj);
};
