import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { AppProvider, AppProviderProps, ContentProviderProps, LocaleProviderProps, ThemeProviderProps, Theme } from '..';
import { theming } from '../Contexts';

export const getAppStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		border: `1px solid ${theme.splitter}`,
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.appBg,
	},
});

export const useAppStyles = createUseStyles(getAppStyles, { name: 'App', theming });

type PureProps = {
	setAppElement: (x: HTMLElement | null) => void;
};

const PureView: React.FC<PureProps> = (props) => {
	const { children, setAppElement } = props;
	const classes = useAppStyles();

	return (
		<div ref={setAppElement} className={classes.root}>
			{children}
		</div>
	);
};

export type AppProps =
	& ContentProviderProps
	& LocaleProviderProps
	& ThemeProviderProps;

export const App: React.FC<AppProps> = (props) => {
	const { children } = props;

	const [appElement, setAppElement] = useState<HTMLElement>(document.body);

	const contextProps: AppProviderProps = {
		...props,
		appElement,
	};

	return (
		<AppProvider {...contextProps}>
			<PureView setAppElement={(x) => x && setAppElement(x)}>
				{children}
			</PureView>
		</AppProvider>
	);
};
