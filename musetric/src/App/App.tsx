import React, { useState } from 'react';
import {
	Theme, ThemeProvider, ThemeProviderProps,
	AppElementProvider, useAppElementContext, LocaleProvider, LocaleProviderProps,
	AppTitlebar, Switch, SwitchProps, Button, InfoIcon, useLocaleContext, useThemeContext,
	localizeColorThemeId, localizeLocaleId, getButtonClasses, AboutInfo, ModalDialog,
} from '..';
import { createUseClasses } from './Theme';

export const getAppClasses = (theme: Theme) => ({
	root: {
		'box-sizing': 'border-box',
		width: theme.platform.width,
		height: theme.platform.height,
		border: `1px solid ${theme.color.splitter}`,
		display: 'grid',
		gridTemplateRows: '48px 1fr',
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

	const { setModalDialog } = useAppElementContext();
	const { localeId, setLocaleId, localeIdList } = useLocaleContext();
	const { colorThemeId, setColorThemeId, allColorThemeIds } = useThemeContext();

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
		const value = (
			<ModalDialog closeModal={() => setModalDialog()}>
				<AboutInfo />
			</ModalDialog>
		);
		setModalDialog(value);
	};

	const { setAppElement } = useAppElementContext();
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
