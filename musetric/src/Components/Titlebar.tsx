import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, localizeLocaleId, AppElementContext, LocaleContext, ThemeContext, localizeColorThemeId, Switch, SwitchProps, AppIcon, InfoIcon, Button, ModalDialog, AboutInfo } from '..';
import { theming } from '../Contexts';

export const getTitlebarStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		height: '32px',
		background: theme.color.sidebarBg,
		cursor: 'default',
		'-webkit-app-region': 'drag',
		'-webkit-user-select': 'none',
		'border-bottom': `1px solid ${theme.color.splitter}`,
	},
	icon: {
		flexGrow: '1',
		maxWidth: '32px',
		maxHeight: '32px',
		'& path': {
			fill: theme.color.icon,
		},
	},
	text: {
		flexGrow: '2',
		maxHeight: '32px',
		width: 'auto',
		font: '12px/32px "Segoe UI", Arial, sans-serif',
		color: theme.color.content,
		textIndent: '10px',
	},
});

export const useTitlebarStyles = createUseStyles(getTitlebarStyles, { name: 'Titlebar', theming });

export type TitlebarProps = {
};

export const Titlebar: React.FC<TitlebarProps> = () => {
	const classes = useTitlebarStyles();

	const { setModalDialog } = useContext(AppElementContext);
	const { localeId, setLocaleId, localeIdList } = useContext(LocaleContext);
	const { colorThemeId, setColorThemeId, allColorThemeIds } = useContext(ThemeContext);

	const themeSwitchProps: SwitchProps<string> = {
		currentId: colorThemeId,
		ids: allColorThemeIds,
		set: (id) => {
			setColorThemeId(id);
		},
		view: (id, t) => localizeColorThemeId(id, t) || id,
	};

	const localeSwitchProps: SwitchProps<string> = {
		currentId: localeId,
		ids: localeIdList,
		set: setLocaleId,
		view: (id, t) => localizeLocaleId(id, t) || id,
	};

	const openAboutDialog = () => {
		setModalDialog(<ModalDialog><AboutInfo /></ModalDialog>);
	};

	return (
		<div className={classes.root}>
			<div className={classes.icon}><AppIcon /></div>
			<div className={classes.text}>Musetric</div>
			<Switch {...themeSwitchProps} />
			<Switch {...localeSwitchProps} />
			<Button onClick={openAboutDialog}><InfoIcon /></Button>
		</div>
	);
};
