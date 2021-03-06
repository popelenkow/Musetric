import React, { useContext, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { AppElementProvider, AppElementContext, ContentProvider, LocaleProvider, ThemeProvider, ContentProviderProps, LocaleProviderProps, ThemeProviderProps, Theme } from '..';
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

type RootProps = {
};

const Root: React.FC<RootProps> = (props) => {
	const { children } = props;
	const classes = useAppStyles();

	const { setAppElement } = useContext(AppElementContext);
	return (
		<div ref={(elem) => elem && setAppElement(elem)} className={classes.root}>
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

	const [modal, setModal] = useState<React.ReactNode>();
	return (
		<LocaleProvider {...props}>
			<ThemeProvider {...props}>
				<ContentProvider {...props}>
					<AppElementProvider initAppElement={document.body} setModalDialog={setModal}>
						<Root>
							{children}
							{modal}
						</Root>
					</AppElementProvider>
				</ContentProvider>
			</ThemeProvider>
		</LocaleProvider>
	);
};
