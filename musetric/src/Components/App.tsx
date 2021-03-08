import React, { useContext, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { AppElementProvider, AppElementContext, LocaleProvider, ThemeProvider, LocaleProviderProps, ThemeProviderProps, Theme } from '..';
import { theming } from '../Contexts';

export const getAppStyles = (theme: Theme) => ({
	root: {
		width: `calc(${theme.platform.width} - 2px)`,
		height: `calc(${theme.platform.height} - 2px)`,
		border: `1px solid ${theme.color.splitter}`,
		display: 'grid',
		gridTemplateRows: '33px 1fr',
		gridTemplateColumns: '1fr',
		color: theme.color.content,
		backgroundColor: theme.color.appBg,
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
	& LocaleProviderProps
	& ThemeProviderProps;

export const App: React.FC<AppProps> = (props) => {
	const { children } = props;

	const [modal, setModal] = useState<React.ReactNode>();

	return (
		<LocaleProvider {...props}>
			<ThemeProvider {...props}>
				<AppElementProvider initAppElement={document.body} setModalDialog={setModal}>
					<Root>
						{children}
						{modal}
					</Root>
				</AppElementProvider>
			</ThemeProvider>
		</LocaleProvider>
	);
};
