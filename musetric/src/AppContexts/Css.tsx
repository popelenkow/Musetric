import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Classes, GenerateId } from 'jss';
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { JssProvider, createTheming, createUseStyles, Styles } from 'react-jss';
import { Theme, ThemeEntry } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';
import { useRootElementContext } from './RootElement';

export type Css = {
	theme: Theme,
};
// eslint-disable-next-line
export const ThemingContext = createContext<Css>(undefined as any);
export const theming = createTheming(ThemingContext);

type CreateClasses = <T>(create: (css: Css) => T) => ((css: Css) => T);
export const createClasses: CreateClasses = (create) => (css: Css) => create(css);

export const createUseClasses = <C extends string, Props>(
	name: string,
	styles: Styles<C, Props, Css> | ((theme: Css) => Styles<C, Props, undefined>),
): (data?: Props & { theme?: Css }) => Classes<C> => {
	return createUseStyles(styles, { name, theming });
};

export type CssStore = {
	css: Css,
	themeId: string,
	setThemeId: (id: string) => void,
	allThemeIds: string[],
};
export const CssContext = createContext<CssStore | undefined>(undefined);

const visualViewport = window.visualViewport ?? window;

const usePlatform = (): void => {
	useEffect(() => {
		const resize = (): void => {
			const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
			const top = window.visualViewport ? window.visualViewport.offsetTop : 0;
			document.documentElement.style.setProperty(
				'--100vh',
				`${height}px`,
			);
			document.documentElement.style.setProperty(
				'--screenTop',
				`${top}px`,
			);
		};
		resize();

		visualViewport.addEventListener('resize', resize);
		visualViewport.addEventListener('scroll', resize);
		return (): void => {
			visualViewport.removeEventListener('resize', resize);
			visualViewport.removeEventListener('scroll', resize);
		};
	}, []);
};

const HoverableInjection: SFC<object, { result: 'none' }> = () => {
	const { rootElement } = useRootElementContext();

	useEffect(() => {
		rootElement.classList.add('hoverable');
		let isTouch = false;
		const onTouch = (): void => {
			if (isTouch) return;
			isTouch = true;
			rootElement.classList.add('hoverable');
		};
		const onCursor = (): void => {
			if (!isTouch) return;
			isTouch = false;
			rootElement.classList.remove('hoverable');
		};
		document.addEventListener('touchstart', onTouch);
		document.addEventListener('touchmove', onTouch);
		document.addEventListener('touchend', onTouch);
		document.addEventListener('mousedown', onCursor);
		document.addEventListener('mousemove', onCursor);
		document.addEventListener('mouseup', onCursor);
		return (): void => {
			document.removeEventListener('touchstart', onTouch);
			document.removeEventListener('touchmove', onTouch);
			document.removeEventListener('touchend', onTouch);
			document.removeEventListener('mousedown', onCursor);
			document.removeEventListener('mousemove', onCursor);
			document.removeEventListener('mouseup', onCursor);
			rootElement.classList.remove('hoverable');
		};
	}, [rootElement]);
	return null;
};

export type CssProviderProps = {
	initThemeId?: string,
	allThemeEntries: ThemeEntry[],
	onSetThemeId?: (themeId: string) => void,
};
export const CssProvider: SFC<CssProviderProps, { children: 'required' }> = (props) => {
	const { children, initThemeId, allThemeEntries, onSetThemeId } = props;

	const allThemeIds = allThemeEntries.map((x) => x.themeId);
	const [themeId, setThemeId] = useState<string>(initThemeId || allThemeIds[0]);
	const themeEntry = allThemeEntries.find((x) => x.themeId === themeId);
	const { theme = allThemeEntries[0].theme } = themeEntry || { };
	usePlatform();

	const store: CssStore = useMemo(() => ({
		css: { theme },
		themeId,
		setThemeId: (id: string): void => {
			setThemeId(id);
			if (onSetThemeId) onSetThemeId(id);
		},
		allThemeIds,
	}), [allThemeIds, onSetThemeId, theme, themeId]);

	const generateId: GenerateId = (rule, sheet) => {
		const prefix = sheet?.options?.classNamePrefix || '';
		if (prefix && rule.key === 'root') return prefix.slice(0, prefix.length - 1);
		return `${prefix}${rule.key}`;
	};
	return (
		<CssContext.Provider value={store}>
			<JssProvider generateId={generateId}>
				<theming.ThemeProvider theme={{ theme }}>
					{children}
					<HoverableInjection />
				</theming.ThemeProvider>
			</JssProvider>
		</CssContext.Provider>
	);
};

export const useCssContext = (): CssStore => useInitializedContext(CssContext, 'useCssContext');

export type ClassNameArg = string | Record<string, boolean | undefined>;
export const className = (...args: ClassNameArg[]): string => {
	const resultArr = args.map<Record<string, boolean | undefined>>((arg) => {
		if (typeof arg === 'string') return { [arg]: true };
		if (typeof arg === 'object') return arg;
		return {};
	});
	let resultObj = {};
	resultArr.forEach((obj) => {
		resultObj = { ...resultObj, ...obj };
	});
	return classNames(...args);
};
