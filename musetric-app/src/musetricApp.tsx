import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { App, AppAboutInfo, AppAboutInfoProps, AppProps, AppViewEntry } from 'musetric/App';
import { getStorageLocaleId, setStorageLocaleId, createI18n } from 'musetric/AppBase/Locale';
import { getStorageThemeId, setStorageThemeId } from 'musetric/AppBase/Theme';
import { LocaleProvider, LocaleProviderProps } from 'musetric/AppContexts/LocaleContext';
import { CssProvider, CssProviderProps } from 'musetric/AppContexts/CssContext';
import { IconProvider, IconProviderProps } from 'musetric/AppContexts/IconContext';
import { WorkerProvider, WorkerProviderProps } from 'musetric/AppContexts/WorkerContext';
import { Button } from 'musetric/Controls/Button';
import { SoundWorkshop } from 'musetric/SoundWorkshop';
import { CreateMusetricApp } from './types/musetricApp';

export const createMusetricApp: CreateMusetricApp = async (options) => {
	const { elementId, allLocaleEntries, allThemeEntries, icons } = options;

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

		const createSpectrumWorker = () => new Worker(new URL('./musetricSpectrum.ts', import.meta.url), {
			name: 'musetricSpectrum',
		});
		const createWavConverterWorker = () => new Worker(new URL('./musetricWavConverter.ts', import.meta.url), {
			name: 'musetricWavConverter',
		});
		const workerProviderProps: WorkerProviderProps = {
			workers: {
				createSpectrumWorker,
				createWavConverterWorker,
			},
		};
		return (
			<WorkerProvider {...workerProviderProps}>
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
		initViewId: 'soundWorkshop',
		allViewEntries,
	};

	const app = <App {...appProps} />;

	const root = document.getElementById(elementId);
	if (!root) throw new Error();
	ReactDOM.render(app, root);
};
