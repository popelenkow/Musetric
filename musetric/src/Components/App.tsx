import React, { useState } from 'react';
import {
	Theme, createUseClasses, ThemeProvider, ThemeProviderProps,
	AppElementProvider, useAppElement, LocaleProvider, LocaleProviderProps,
	AppTitlebar, Switch, SwitchProps, Button, InfoIcon, useLocale, useTheme,
	localizeColorThemeId, localizeLocaleId, getButtonClasses, AboutInfo, ModalDialog,
} from '..';

export const getAppClasses = (theme: Theme) => ({
	root: {
		width: `calc(${theme.platform.width} - 2px)`,
		height: `calc(${theme.platform.height} - 2px)`,
		border: `1px solid ${theme.color.splitter}`,
		display: 'grid',
		gridTemplateRows: '49px 1fr',
		gridTemplateColumns: '1fr',
	},
	textButton: {
		...getButtonClasses(theme).root,
		width: 'auto',
		padding: '0 6px',
	},
});

export const useAppClasses = createUseClasses('App', getAppClasses);

type RootProps = {
};

const Root: React.FC<RootProps> = (props) => {
	const { children } = props;
	const classes = useAppClasses();

	const { setModalDialog } = useAppElement();
	const { localeId, setLocaleId, localeIdList } = useLocale();
	const { colorThemeId, setColorThemeId, allColorThemeIds } = useTheme();

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

	const { setAppElement } = useAppElement();
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
