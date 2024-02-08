// eslint-disable-next-line import/no-extraneous-dependencies
import { Classes, GenerateId } from 'jss';
import React, { createContext, useMemo, useEffect } from 'react';
import { JssProvider, createUseStyles, Styles } from 'react-jss';
import { Theme, getComputedTheme } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';
import { useAppRootElement } from './AppContext';

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
    themeId: string,
    allThemeIds: string[],
    setThemeId: (themeId: string) => void,
};
export const CssProvider: SFC<CssProviderProps, { children: 'required' }> = (props) => {
    const { children, themeId, allThemeIds, setThemeId } = props;

    const { rootElement } = useAppRootElement();

    const store = useMemo((): CssStore => {
        const theme = getComputedTheme(rootElement);
        return {
            theme,
            themeId,
            setThemeId,
            allThemeIds,
        };
    }, [allThemeIds, setThemeId, rootElement, themeId]);

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
