import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, localizeLocaleId, AppElementContext, LocaleContext, ThemeContext, localizeColorThemeId, Switch, SwitchProps, AppIcon, InfoIcon, Button, ModalDialog, AboutInfo, getButtonStyles, useButtonStyles } from '..';
import { theming } from '../Contexts';

export const getAppTitlebarStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		height: '48px',
		background: theme.color.sidebar,
		cursor: 'default',
		'justify-content': 'center',
		'align-items': 'center',
		'-webkit-app-region': 'drag',
		'-webkit-user-select': 'none',
		'border-bottom': `1px solid ${theme.color.splitter}`,
	},
	icon: {
		flexGrow: '1',
		maxWidth: '48px',
		maxHeight: '48px',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'& path': {
			fill: theme.color.content,
		},
	},
	text: {
		flexGrow: '2',
		maxHeight: '48px',
		width: 'auto',
		font: '18px/48px "Segoe UI", Arial, sans-serif',
		color: theme.color.content,
		textIndent: '10px',
	},
	textButton: {
		...getButtonStyles(theme).root,
		width: 'auto',
		padding: '0 12px',
	},
});

export const useAppTitlebarStyles = createUseStyles(getAppTitlebarStyles, { name: 'AppTitlebar', theming });

export type AppTitlebarProps = {
};

export const AppTitlebar: React.FC<AppTitlebarProps> = () => {
	const classes = useAppTitlebarStyles();
	const buttonClasses = useButtonStyles();

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
		className: classes.textButton,
	};

	const localeSwitchProps: SwitchProps<string> = {
		currentId: localeId,
		ids: localeIdList,
		set: setLocaleId,
		view: (id, t) => localizeLocaleId(id, t) || id,
		className: classes.textButton,
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
			<Button className={buttonClasses.root} onClick={openAboutDialog}><InfoIcon /></Button>
		</div>
	);
};
