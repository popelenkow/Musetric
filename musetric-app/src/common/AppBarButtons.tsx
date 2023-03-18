import { useAppLocale } from 'musetric/App/AppContext';
import { useAppCss } from 'musetric/App/AppCss';
import { localizeLocaleId, localizeThemeId } from 'musetric/AppBase/Locale';
import { Icon } from 'musetric/Controls/Icon';
import { Switch, SwitchProps } from 'musetric/Controls/Switch';
import { skipPromise } from 'musetric/Utils/SkipPromise';
import React, { ReactElement, ReactNode } from 'react';

export const useAppBarButtons = (): ReactElement => {
	const { localeId, setLocaleId, allLocaleIds, i18n } = useAppLocale();
	const { themeId, setThemeId, allThemeIds } = useAppCss();

	const themeMap: Record<string, JSX.Element> = {
		light: <Icon name='light' />,
		dark: <Icon name='dark' />,
	};

	const getLocale = (): string => {
		return localizeLocaleId(localeId, i18n) || localeId;
	};
	const localeSwitchProps: SwitchProps<string> = {
		rounded: true,
		currentId: localeId,
		ids: allLocaleIds,
		set: (id) => skipPromise(setLocaleId(id)),
		title: getLocale(),
	};

	const themeSwitchProps: SwitchProps<string> = {
		kind: 'icon',
		rounded: true,
		currentId: themeId,
		ids: allThemeIds,
		set: setThemeId,
		title: localizeThemeId(themeId, i18n) || themeId,
	};
	const getTheme = (): ReactNode => {
		const icon = themeMap[themeId];
		if (icon) return icon;
		return localizeThemeId(themeId, i18n) || themeId;
	};

	return (
		<>
			<Switch key={0} {...localeSwitchProps}>{getLocale()}</Switch>
			<Switch key={1} {...themeSwitchProps}>{getTheme()}</Switch>
		</>
	);
};
