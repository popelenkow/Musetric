import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Classes, GenerateId } from 'jss';
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { JssProvider, createUseStyles, Styles } from 'react-jss';
import { Theme, ThemeEntry, themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';
import { useAppRootElement } from './AppContext';

const useStyles = createUseStyles((theme: Theme) => ({
    '@global': {
        ':root': Object.entries(themeVariables).reduce((acc, [key, variable]) => ({
            ...acc,
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            [variable]: theme[key as keyof Theme],
        }), {}),
    },
}));

export const createUseClasses = <C extends string, Props>(
    name: string,
    styles: Styles<C, Props>,
): (data?: Props & { theme?: undefined }) => Classes<C> => {
    const generateId: GenerateId = (rule) => {
        if (rule.key === 'root') return name;
        return `${name}__${rule.key}`;
    };
    return createUseStyles(styles, { name, generateId });
};

export type CssStore = {
    theme: Theme,
    themeId: string,
    setThemeId: (id: string) => void,
    allThemeIds: string[],
};
export const CssContext = createContext<CssStore | undefined>(undefined);

const visualViewport = window.visualViewport ?? window;

const AppSizeInjection: SFC<object, { result: 'none' }> = () => {
    useEffect(() => {
        const resize = (): void => {
            const height = window.visualViewport?.height ?? window.innerHeight;
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
    return null;
};

const HoverableInjection: SFC<object, { result: 'none' }> = () => {
    const { rootElement } = useAppRootElement();

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
    const { theme } = themeEntry ?? allThemeEntries[0];

    useStyles({ theme });

    const store: CssStore = useMemo(() => ({
        theme,
        themeId,
        setThemeId: (id: string): void => {
            setThemeId(id);
            if (onSetThemeId) onSetThemeId(id);
        },
        allThemeIds,
    }), [allThemeIds, onSetThemeId, theme, themeId]);

    return (
        <CssContext.Provider value={store}>
            <JssProvider>
                {children}
                <HoverableInjection />
                <AppSizeInjection />
            </JssProvider>
        </CssContext.Provider>
    );
};

export const useAppCss = (): CssStore => useInitializedContext(CssContext, 'useCssContext');

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
