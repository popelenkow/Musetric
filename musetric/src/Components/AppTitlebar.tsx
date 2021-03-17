import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, AppIcon } from '..';
import { theming } from '../Contexts';

export const getAppTitlebarStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		height: '48px',
		'column-gap': '4px',
		background: theme.color.sidebar,
		cursor: 'default',
		'align-items': 'center',
		'border-bottom': `1px solid ${theme.color.splitter}`,
	},
	icon: {
		'flex-grow': '1',
		'max-width': '42px',
		'max-height': '42px',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'& path': {
			fill: theme.color.content,
		},
	},
	text: {
		flexGrow: '2',
		'user-select': 'none',
		'max-height': '42px',
		width: 'auto',
		font: '18px/42px "Segoe UI", Arial, sans-serif',
		color: theme.color.content,
	},
});

export const useAppTitlebarStyles = createUseStyles(getAppTitlebarStyles, { name: 'AppTitlebar', theming });

export type AppTitlebarProps = {
};

export const AppTitlebar: React.FC<AppTitlebarProps> = (props) => {
	const { children } = props;

	const classes = useAppTitlebarStyles();

	return (
		<div className={classes.root}>
			<div className={classes.icon}><AppIcon /></div>
			<div className={classes.text}>Musetric</div>
			{children}
		</div>
	);
};
