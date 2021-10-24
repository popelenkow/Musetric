import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { App, AppProps, AppViewEntry } from 'musetric/App/App';
import { AppAboutInfo, AppAboutInfoProps } from 'musetric/App/AppAboutInfo';
import { getStorageLocaleId, setStorageLocaleId, createI18n } from 'musetric/AppBase/Locale';
import { getStorageThemeId, setStorageThemeId } from 'musetric/AppBase/Theme';
import { LocaleProvider, LocaleProviderProps } from 'musetric/AppContexts/Locale';
import { CssProvider, CssProviderProps } from 'musetric/AppContexts/Css';
import { IconProvider, IconProviderProps } from 'musetric/AppContexts/Icon';
import { WorkerProvider } from 'musetric/AppContexts/Worker';
import { Button } from 'musetric/Controls/Button';
import { SoundWorkshop } from 'musetric/Workshop';
import type { LocaleEntry } from 'musetric/AppBase/Locale';
import type { ThemeEntry } from 'musetric/AppBase/Theme';
import type { Icons } from 'musetric/AppBase/Icon';
import type { Workers } from 'musetric/AppBase/Worker';
import { TitlebarButtons } from './common/TitlebarButtons';

export type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	icons: Icons;
	workers: Workers;
};
export type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export const createMusetricApp: CreateMusetricApp = async (options) => {
	const { elementId, allLocaleEntries, allThemeEntries, icons, workers } = options;

	const initLocaleId = getStorageLocaleId() || 'en';
	const i18n = await createI18n(initLocaleId, allLocaleEntries);
	const AppLocaleProvider: FC = (props) => {
		const { children } = props;
		const localeProviderProps: LocaleProviderProps = {
			i18n,
			allLocaleEntries,
			onSetLocaleId: setStorageLocaleId,
		};
		return (
			<LocaleProvider {...localeProviderProps}>
				{children}
			</LocaleProvider>
		);
	};

	const AppCssProvider: FC = (props) => {
		const { children } = props;
		const initThemeId = getStorageThemeId() || 'dark';

		const cssProviderProps: CssProviderProps = {
			initThemeId,
			allThemeEntries,
			onSetThemeId: setStorageThemeId,
		};
		return (
			<CssProvider {...cssProviderProps}>
				{children}
			</CssProvider>
		);
	};

	const AppWorkerProvider: FC = (props) => {
		const { children } = props;

		return (
			<WorkerProvider workers={workers}>
				{children}
			</WorkerProvider>
		);
	};

	const AppIconProvider: FC = (props) => {
		const { children } = props;

		const iconProviderProps: IconProviderProps = {
			icons,
		};
		return (
			<IconProvider {...iconProviderProps}>
				{children}
			</IconProvider>
		);
	};

	type ViewId = 'soundWorkshop' | 'aboutInfo';
	const createViewEntries = (): AppViewEntry<ViewId>[] => {
		const { GithubIcon, PerformanceIcon } = icons;

		const soundWorkshop = <SoundWorkshop />;
		const aboutInfoProps: AppAboutInfoProps = {
			appVersion: process.env.APP_VERSION || '???',
			links: [
				<Button key='links_0' onClick={() => { window.location.href = 'https://github.com/popelenkow/Musetric'; }}><GithubIcon /></Button>,
				<Button key='links_1' onClick={() => { window.location.href = `${window.location.origin}/perf.html`; }}><PerformanceIcon /></Button>,
			],
		};
		const aboutInfo = <AppAboutInfo {...aboutInfoProps} />;

		return [
			{ viewId: 'soundWorkshop', viewElement: soundWorkshop },
			{ viewId: 'aboutInfo', viewElement: aboutInfo },
		];
	};
	const allViewEntries = createViewEntries();

	const appProps: AppProps<ViewId> = {
		LocaleProvider: AppLocaleProvider,
		CssProvider: AppCssProvider,
		IconProvider: AppIconProvider,
		WorkerProvider: AppWorkerProvider,
		TitlebarButtons,
		initViewId: 'soundWorkshop',
		allViewEntries,
	};

	const app = <App {...appProps} />;

	const root = document.getElementById(elementId);
	if (!root) throw new Error();
	ReactDOM.render(app, root);
};
