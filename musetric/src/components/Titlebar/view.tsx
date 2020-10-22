/* eslint-disable max-len */
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Controls, Types, Locales, Contexts } from '../..';
import { icons } from './icons';

export type Props = {
	app: HTMLElement;
};

export const View: React.FC<Props> = (props) => {
	const { children, app } = props;
	const { i18n } = useTranslation();

	const { contentId, setContentId, theme, setTheme, locale, setLocale } = useContext(Contexts.AppContext.Context);

	const contentSwitchProps: Controls.Switch.Props<Types.ContentId> = {
		currentId: contentId || Types.contentSet[0],
		ids: Types.contentSet,
		set: (id) => setContentId && setContentId(id),
		className: 'Titlebar__Button',
		localize: (id, _t) => id,
	};

	const themeSwitchProps: Controls.Switch.Props<Types.Theme> = {
		currentId: theme || Types.themeSet[0],
		ids: Types.themeSet,
		set: (id) => {
			app.classList.forEach(x => Types.isTheme(x) && app.classList.remove(x));
			app.classList.add(id);
			setTheme && setTheme(id);
		},
		className: 'Titlebar__Button',
		localize: (id, t) => Locales.localizeTheme(id, t) || id,
	};

	const localeSwitchProps: Controls.Switch.Props<Types.Locale> = {
		currentId: locale || Types.localeSet[0],
		ids: Types.localeSet,
		set: (id) => {
			setLocale && setLocale(id);
			i18n.changeLanguage(id);
		},
		className: 'Titlebar__Button',
		localize: (id, t) => Locales.localizeLocale(id, t) || id,
	};

	return (
		<div className='Titlebar'>
			<div className='Titlebar__Icon'>{icons.app}</div>
			<div className='Titlebar__Text'>Musetric</div>
			<Controls.Switch.View {...contentSwitchProps} />
			<Controls.Switch.View {...themeSwitchProps} />
			<Controls.Switch.View {...localeSwitchProps} />
			{children}
		</div>
	);
};
