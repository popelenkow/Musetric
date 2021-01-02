import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Components, Types, Locales, Contexts } from '../..';
import { icons } from './icons';

export type Props = {
};

export const View: React.FC<Props> = (props) => {
	const { children } = props;
	const { i18n } = useTranslation();

	const {
		appElement,
		contentId, setContentId,
		theme, setTheme,
		locale, setLocale,
	} = useContext(Contexts.App.Context);

	const contentSwitchProps: Components.Switch.Props<Types.ContentId> = {
		currentId: contentId || Types.contentSet[0],
		ids: Types.contentSet,
		set: (id) => setContentId(id),
		className: 'Titlebar__Button',
		localize: (id) => id,
	};

	const themeSwitchProps: Components.Switch.Props<Types.Theme> = {
		currentId: theme || Types.themeSet[0],
		ids: Types.themeSet,
		set: (id) => {
			const app = appElement || document.body;
			app.classList.forEach(x => Types.isTheme(x) && app.classList.remove(x));
			app.classList.add(id);
			setTheme(id);
		},
		className: 'Titlebar__Button',
		localize: (id, t) => Locales.localizeTheme(id, t) || id,
	};

	const localeSwitchProps: Components.Switch.Props<Types.Locale> = {
		currentId: locale || Types.localeSet[0],
		ids: Types.localeSet,
		set: (id) => {
			setLocale(id);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			i18n.changeLanguage(id);
		},
		className: 'Titlebar__Button',
		localize: (id, t) => Locales.localizeLocale(id, t) || id,
	};

	return (
		<div className='Titlebar'>
			<div className='Titlebar__Icon'>{icons.app}</div>
			<div className='Titlebar__Text'>Musetric</div>
			<Components.Switch.View {...contentSwitchProps} />
			<Components.Switch.View {...themeSwitchProps} />
			<Components.Switch.View {...localeSwitchProps} />
			{children}
		</div>
	);
};
