import React, { useState } from 'react';
import {
	AppCss, AppCssProvider, AppCssProviderProps,
	AppElementProvider, useAppElementContext, AppLocaleProvider, AppLocaleProviderProps,
	AppTitlebar, Switch, SwitchProps, Button, InfoIcon, useAppLocaleContext, useAppCssContext,
	localizeThemeId, localizeLocaleId, getButtonClasses, AboutInfo, ModalDialog,
} from '..';
import { createUseClasses } from './AppCssContext';

export const getAppClasses = (css: AppCss) => ({
	root: {
		'box-sizing': 'border-box',
		width: css.platform.width,
		height: css.platform.height,
		border: `1px solid ${css.theme.splitter}`,
		display: 'grid',
		'grid-template-rows': '48px 1fr',
		'grid-template-columns': '1fr',
	},
	textButton: {
		...getButtonClasses(css).root,
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
	const { localeId, setLocaleId, localeIdList } = useAppLocaleContext();
	const { themeId, setThemeId, allThemeIds } = useAppCssContext();

	const themeSwitchProps: SwitchProps<string> = {
		currentId: themeId,
		ids: allThemeIds,
		set: (id) => {
			setThemeId(id);
		},
		view: (id, t) => localizeThemeId(id, t) || id,
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
	& AppLocaleProviderProps
	& AppCssProviderProps;

export const App: React.FC<AppProps> = (props) => {
	const { children } = props;

	const [modalDialog, setModalDialog] = useState<React.ReactNode>();

	return (
		<AppLocaleProvider {...props}>
			<AppCssProvider {...props}>
				<AppElementProvider initAppElement={document.body} setModalDialog={setModalDialog}>
					<Root>
						{children}
						{modalDialog}
					</Root>
				</AppElementProvider>
			</AppCssProvider>
		</AppLocaleProvider>
	);
};
