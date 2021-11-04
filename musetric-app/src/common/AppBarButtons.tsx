import React, { FC } from 'react';
import { localizeLocaleId, localizeThemeId } from 'musetric/AppBase/Locale';
import { useLocaleContext } from 'musetric/AppContexts/Locale';
import { useCssContext } from 'musetric/AppContexts/Css';
import { useIconContext } from 'musetric/AppContexts/Icon';
import { Switch, SwitchProps } from 'musetric/Controls/Switch';

export const AppBarButtons: FC = () => {
	const { localeId, setLocaleId, allLocaleIds } = useLocaleContext();
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
		view: (id, t) => localizeLocaleId(id, t) || id,
	};

	const themeSwitchProps: SwitchProps<string> = {
		kind: 'icon',
		rounded: true,
		currentId: themeId,
		ids: allThemeIds,
		set: (id) => {
			setThemeId(id);
		},
		view: (id, t) => {
			const Icon = themeMap[id];
			if (Icon) return <Icon />;
			return localizeThemeId(id, t) || id;
		},
	};

	return (
		<>
			<Switch {...localeSwitchProps} />
			<Switch {...themeSwitchProps} />
		</>
	);
};
