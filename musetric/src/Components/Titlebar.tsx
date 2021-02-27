import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { ContentId, contentIdList, Theme, localizeLocaleId, ContentContext, LocaleContext, ThemeContext, localizeThemeId, Switch, SwitchProps } from '..';
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

export const Icons = {
	app: <svg width='32' height='32' viewBox='0 0 135.47 135.47'><g transform='translate(0 -161.53)'><path transform='matrix(.26458 0 0 .26458 0 161.53)' d='m256 56a200 200 0 0 0-200 200 200 200 0 0 0 54.283 136.78 33.75 48.214 75 0 1-3.0781-6.8164 33.75 48.214 75 0 1 37.836-45.078 33.75 48.214 75 0 1 23.975-1.9082v-204.4l192.58-48.145a200 200 0 0 0-105.59-30.436zm105.87 30.607v240.83l-0.02344 0.00586a33.75 48.214 75 0 1-38.629 38.645 33.75 48.214 75 0 1-55.307-20.121 33.75 48.214 75 0 1 37.836-45.078 33.75 48.214 75 0 1 23.982-1.9082v-150.11l-128.57 32.145v26.498h-0.00196v160.11l-0.00781 0.00196a33.75 48.214 75 0 1-38.639 38.471 33.75 48.214 75 0 1-43.609-4.8106 200 200 0 0 0 137.1 54.723 200 200 0 0 0 200-200 200 200 0 0 0-94.127-169.39z' /></g></svg>,
};

export type TitlebarProps = {
};

export const Titlebar: React.FC<TitlebarProps> = (props) => {
	const { children } = props;
	const classes = useTitlebarStyles();

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

	return (
		<div className={classes.root}>
			<div className={classes.icon}>{Icons.app}</div>
			<div className={classes.text}>Musetric</div>
			<Switch {...contentSwitchProps} />
			<Switch {...themeSwitchProps} />
			<Switch {...localeSwitchProps} />
			{children}
		</div>
	);
};
