import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Locales, Themes, Components, Controls } from 'musetric';
import { initLocale } from './locales';
import { Titlebar } from './components';

const app = document.getElementById('app');
if (!app) throw new Error('App not found');

const params = new URLSearchParams(window.location.search);
const locale = initLocale(params.get('locale'));

const extractTheme: () => Themes.Theme | undefined = () => {
	const themes: Themes.Theme[] = [];
	app.classList.forEach(x => Themes.isTheme(x) && themes.push(x));
	return themes.shift();
};

const themeSwitchProps: Controls.Switch.Props<Themes.Theme> = {
	currentId: extractTheme() || Themes.themeSet[0],
	ids: Themes.themeSet,
	set: (theme: Themes.Theme) => {
		app.classList.forEach(x => Themes.isTheme(x) && app.classList.remove(x));
		app.classList.add(theme);
	},
	className: 'Titlebar__Button',
	localize: (theme, t) => Locales.localizeTheme(theme, t) || theme,
};

const localeSwitchProps: Controls.Switch.Props<Locales.Locale> = {
	currentId: locale,
	ids: Locales.localeSet,
	set: (id: Locales.Locale) => {
		i18n.changeLanguage(id);
	},
	className: 'Titlebar__Button',
	localize: (id, t) => Locales.localizeLocale(id, t) || id,
};

const root = (
	<Suspense fallback='loading'>
		<Titlebar.View>
			<Controls.Switch.View {...themeSwitchProps} />
			<Controls.Switch.View {...localeSwitchProps} />
		</Titlebar.View>
		<div className='main'>
			<Components.Container.View><Components.Recorder.View /></Components.Container.View>
		</div>
	</Suspense>
);
ReactDOM.render(root, app);
