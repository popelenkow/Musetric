import React, { FC, ReactElement, ReactNode } from 'react';
import { localizeLocaleId, localizeThemeId } from 'musetric/AppBase/Locale';
import { useLocaleContext } from 'musetric/AppContexts/Locale';
import { useCssContext } from 'musetric/AppContexts/Css';
import { useIconContext } from 'musetric/AppContexts/Icon';
import { Switch, SwitchProps } from 'musetric/Controls/Switch';
import { skipPromise } from 'musetric/Utils/SkipPromise';

export const useAppBarButtons = (): ReactElement => {
	const { localeId, setLocaleId, allLocaleIds, i18n } = useLocaleContext();
	const { themeId, setThemeId, allThemeIds } = useCssContext();
	const { DarkIcon, LightIcon } = useIconContext();

	const themeMap: Record<string, FC> = {
		light: LightIcon,
		dark: DarkIcon,
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
		set: (id) => {
			setThemeId(id);
		},
		title: localizeThemeId(themeId, i18n) || themeId,
	};
	const getTheme = (): ReactNode => {
		const Icon = themeMap[themeId];
		if (Icon) return <Icon />;
		return localizeThemeId(themeId, i18n) || themeId;
	};

	return (
		<>
			<Switch {...localeSwitchProps}>{getLocale()}</Switch>
			<Switch {...themeSwitchProps}>{getTheme()}</Switch>
		</>
	);
};
