import React, { FC } from 'react';
import { localizeLocaleId, localizeThemeId } from 'musetric/AppBase/Locale';
import { useLocaleContext } from 'musetric/AppContexts/Locale';
import { useCssContext, createClasses, createUseClasses } from 'musetric/AppContexts/Css';
import { useIconContext } from 'musetric/AppContexts/Icon';
import { getButtonClasses } from 'musetric/Controls/Button';
import { Switch, SwitchProps } from 'musetric/Controls/Switch';

export const getTitlebarButtonsClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	return {
		text: {
			...buttonClasses.root,
			width: 'auto',
			padding: '0 6px',
		},
	};
});
const useClasses = createUseClasses('App', getTitlebarButtonsClasses);

export const TitlebarButtons: FC = () => {
	const { localeId, setLocaleId, allLocaleIds } = useLocaleContext();
	const { themeId, setThemeId, allThemeIds } = useCssContext();
	const { DarkIcon, LightIcon } = useIconContext();
	const themeMap: Record<string, FC> = {
		light: LightIcon,
		dark: DarkIcon,
	};
	const classes = useClasses();

	const localeSwitchProps: SwitchProps<string> = {
		currentId: localeId,
		ids: allLocaleIds,
		set: setLocaleId,
		view: (id, t) => localizeLocaleId(id, t) || id,
		className: classes.text,
	};

	const themeSwitchProps: SwitchProps<string> = {
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
