import React, { useContext, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { AppElementProvider, AppElementContext, LocaleProvider,
	ThemeProvider, LocaleProviderProps, ThemeProviderProps, Theme,
	AppTitlebar, Switch, SwitchProps, Button, InfoIcon, LocaleContext, ThemeContext,
	localizeColorThemeId, localizeLocaleId, getButtonStyles, AboutInfo, ModalDialog,
} from '..';
import { theming } from '../Contexts';

export const getAppStyles = (theme: Theme) => ({
	root: {
		width: `calc(${theme.platform.width} - 2px)`,
		height: `calc(${theme.platform.height} - 2px)`,
		border: `1px solid ${theme.color.splitter}`,
		display: 'grid',
		gridTemplateRows: '49px 1fr',
		gridTemplateColumns: '1fr',
	},
	textButton: {
		...getButtonStyles(theme).root,
		width: 'auto',
		padding: '0 6px',
	},
});

export const useAppStyles = createUseStyles(getAppStyles, { name: 'App', theming });

type RootProps = {
};

const Root: React.FC<RootProps> = (props) => {
	const { children } = props;
	const classes = useAppStyles();

	const { setModalDialog } = useContext(AppElementContext);
	const { localeId, setLocaleId, localeIdList } = useContext(LocaleContext);
	const { colorThemeId, setColorThemeId, allColorThemeIds } = useContext(ThemeContext);

	const themeSwitchProps: SwitchProps<string> = {
		currentId: colorThemeId,
		ids: allColorThemeIds,
		set: (id) => {
			setColorThemeId(id);
		},
		view: (id, t) => localizeColorThemeId(id, t) || id,
		className: classes.textButton,
	};

	const localeSwitchProps: SwitchProps<string> = {
		currentId: localeId,
		ids: localeIdList,
		set: setLocaleId,
		view: (id, t) => localizeLocaleId(id, t) || id,
		className: classes.textButton,
	};

	const openAboutDialog = () => {
		setModalDialog(<ModalDialog><AboutInfo /></ModalDialog>);
	};

	const { setAppElement } = useContext(AppElementContext);
	return (
		<div ref={(elem) => elem && setAppElement(elem)} className={classes.root}>
			<AppTitlebar>
				<Switch {...themeSwitchProps} />
				<Switch {...localeSwitchProps} />
				<Button onClick={openAboutDialog}><InfoIcon /></Button>
			</AppTitlebar>
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
