import React from 'react';
import { createRoot } from 'react-dom/client';
import { App, AppProps, AppProviders } from 'musetric/App/App';
import { AppViewEntry } from 'musetric/App/AppDropdown';
import { AppAbout, AppAboutProps } from 'musetric/App/AppAbout';
import { getStorageLocaleId, setStorageLocaleId, createI18n } from 'musetric/AppBase/Locale';
import { createConsoleLog } from 'musetric/AppBase/Log';
import { getStorageThemeId, setStorageThemeId } from 'musetric/AppBase/Theme';
import { LocaleProvider, LocaleProviderProps } from 'musetric/AppContexts/Locale';
import { LogProvider, LogProviderProps } from 'musetric/AppContexts/Log';
import { CssProvider, CssProviderProps } from 'musetric/AppContexts/Css';
import { IconProvider, IconProviderProps } from 'musetric/AppContexts/Icon';
import { WorkerProvider } from 'musetric/AppContexts/Worker';
import { Button, ButtonProps } from 'musetric/Controls/Button';
import { SoundWorkshop } from 'musetric/Workshop';
import type { LocaleEntry } from 'musetric/AppBase/Locale';
import type { ThemeEntry } from 'musetric/AppBase/Theme';
import type { Icons } from 'musetric/AppBase/Icon';
import type { Workers } from 'musetric/AppBase/Worker';
import { useAppBarButtons } from './common/AppBarButtons';

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

	type ViewId = 'soundWorkshop' | 'about';
	const useViewEntries = (): AppViewEntry<ViewId>[] => {
		const { GithubIcon, PerformanceIcon } = icons;

		const soundWorkshop = <SoundWorkshop />;
		const githubProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			primary: true,
			onClick: () => { window.location.href = 'https://github.com/popelenkow/Musetric'; },
		};
		const performanceProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			primary: true,
			onClick: () => { window.location.href = `${window.location.origin}/perf.html`; },
		};
		const aboutInfoProps: AppAboutProps = {
			appVersion: process.env.APP_VERSION || '???',
			links: [
				<Button key='links_0' {...githubProps}><GithubIcon /></Button>,
				<Button key='links_1' {...performanceProps}><PerformanceIcon /></Button>,
			],
		};
		const aboutInfo = <AppAbout {...aboutInfoProps} />;

		return [
			{ type: 'view', id: 'soundWorkshop', name: i18n.t('App:soundWorkshop'), element: soundWorkshop },
			{ type: 'divider' },
			{ type: 'view', id: 'about', name: i18n.t('App:about'), element: aboutInfo },
		];
	};

	const providers: AppProviders = {
		locale: (children) => {
			const localeProviderProps: LocaleProviderProps = {
				i18n,
				allLocaleEntries,
				onLocaleId: setStorageLocaleId,
			};
			return (
				<LocaleProvider {...localeProviderProps}>
					{children}
				</LocaleProvider>
			);
		},
		log: (children) => {
			const log = createConsoleLog();
			const logProviderProps: LogProviderProps = {
				log,
			};
			return (
				<LogProvider {...logProviderProps}>
					{children}
				</LogProvider>
			);
		},
		css: (children) => {
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
		},
		icon: (children) => {
			const iconProviderProps: IconProviderProps = {
				icons,
			};
			return (
				<IconProvider {...iconProviderProps}>
					{children}
				</IconProvider>
			);
		},
		worker: (children) => {
			return (
				<WorkerProvider workers={workers}>
					{children}
				</WorkerProvider>
			);
		},
	};
	const appProps: AppProps<ViewId> = {
		providers,
		useAppBarButtons,
		initViewId: 'soundWorkshop',
		useViewEntries,
	};

	const rootElement = document.getElementById(elementId);
	if (!rootElement) throw new Error();
	const root = createRoot(rootElement);
	root.render(<App {...appProps} />);
};
