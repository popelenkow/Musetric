import React from 'react';
import { Theme, createUseClasses, AppIcon } from '..';

export const getAppTitlebarClasses = (theme: Theme) => ({
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

export const useAppTitlebarClasses = createUseClasses('AppTitlebar', getAppTitlebarClasses);

export type AppTitlebarProps = {
};

export const AppTitlebar: React.FC<AppTitlebarProps> = (props) => {
	const { children } = props;

	const classes = useAppTitlebarClasses();

	return (
		<div className={classes.root}>
			<div className={classes.icon}><AppIcon /></div>
			<div className={classes.text}>Musetric</div>
			{children}
		</div>
	);
};
