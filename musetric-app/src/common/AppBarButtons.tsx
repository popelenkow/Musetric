import React, { FC, ReactElement } from 'react';
import { localizeLocaleId, localizeThemeId } from 'musetric/AppBase/Locale';
import { useLocaleContext } from 'musetric/AppContexts/Locale';
import { useCssContext } from 'musetric/AppContexts/Css';
import { useIconContext } from 'musetric/AppContexts/Icon';
import { Switch, SwitchProps } from 'musetric/Controls/Switch';

export const useAppBarButtons = (): ReactElement => {
	const { localeId, setLocaleId, allLocaleIds, t } = useLocaleContext();
	const { themeId, setThemeId, allThemeIds } = useCssContext();
	const { DarkIcon, LightIcon } = useIconContext();

	const themeMap: Record<string, FC> = {
		light: LightIcon,
		dark: DarkIcon,
	};

	const localeSwitchProps: SwitchProps<string> = {
		rounded: true,
		currentId: localeId,
		ids: allLocaleIds,
		set: setLocaleId,
	};
	const getLocale = () => {
		return localizeLocaleId(localeId, t) || localeId;
	};

	const themeSwitchProps: SwitchProps<string> = {
		kind: 'icon',
		rounded: true,
		currentId: themeId,
		ids: allThemeIds,
		set: (id) => {
			setThemeId(id);
		},
		title: localizeThemeId(themeId, t) || themeId,
	};
	const getTheme = () => {
		const Icon = themeMap[themeId];
		if (Icon) return <Icon />;
		return localizeThemeId(themeId, t) || themeId;
	};

	return (
		<>
			<Switch {...localeSwitchProps}>{getLocale()}</Switch>
			<Switch {...themeSwitchProps}>{getTheme()}</Switch>
		</>
	);
};
