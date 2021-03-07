import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { ContentId, contentIdList, Theme, localizeLocaleId, AppElementContext, ContentContext, LocaleContext, ThemeContext, localizeThemeId, Switch, SwitchProps, AppIcon, InfoIcon, Button, ModalDialog, AboutInfo } from '..';
import { theming } from '../Contexts';

export const getTitlebarStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		height: '32px',
		background: theme.sidebarBg,
		cursor: 'default',
		'-webkit-app-region': 'drag',
		'-webkit-user-select': 'none',
		'border-bottom': `1px solid ${theme.splitter}`,
	},
	icon: {
		flexGrow: '1',
		maxWidth: '32px',
		maxHeight: '32px',
		'& path': {
			fill: theme.icon,
		},
	},
	text: {
		flexGrow: '2',
		maxHeight: '32px',
		width: 'auto',
		font: '12px/32px "Segoe UI", Arial, sans-serif',
		color: theme.content,
		textIndent: '10px',
	},
});

export const useTitlebarStyles = createUseStyles(getTitlebarStyles, { name: 'Titlebar', theming });

export type TitlebarProps = {
};

export const Titlebar: React.FC<TitlebarProps> = () => {
	const classes = useTitlebarStyles();

	const { setModalDialog } = useContext(AppElementContext);
	const { contentId, setContentId } = useContext(ContentContext);
	const { localeId, setLocaleId, localeIdList } = useContext(LocaleContext);
	const { themeId, setThemeId, themeIdList } = useContext(ThemeContext);

	const contentSwitchProps: SwitchProps<ContentId> = {
		currentId: contentId,
		ids: contentIdList,
		set: setContentId,
		view: (id) => id,
	};

	const themeSwitchProps: SwitchProps<string> = {
		currentId: themeId,
		ids: themeIdList,
		set: (id) => {
			setThemeId(id);
		},
		view: (id, t) => localizeThemeId(id, t) || id,
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
			<Switch {...contentSwitchProps} />
			<Switch {...themeSwitchProps} />
			<Switch {...localeSwitchProps} />
			<Button onClick={openAboutDialog}><InfoIcon /></Button>
		</div>
	);
};
