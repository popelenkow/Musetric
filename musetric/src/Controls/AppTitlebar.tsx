import React from 'react';
import { Theme, createUseClasses, AppIcon, getFieldClasses } from '..';

export const getAppTitlebarClasses = (theme: Theme) => ({
	root: {
		display: 'flex',
		width: 'calc(100% - 6px)',
		height: '42px',
		'column-gap': '4px',
		background: theme.color.sidebar,
		padding: '3px',
		cursor: 'default',
		'align-items': 'center',
		'border-bottom': `1px solid ${theme.color.splitter}`,
	},
	icon: {
		...getFieldClasses(theme).root,
		'flex-grow': '1',
		'max-width': '42px',
		'max-height': '42px',
	},
	text: {
		...getFieldClasses(theme).root,
		'justify-content': 'left',
		'flex-grow': '2',
		'user-select': 'none',
		'max-height': '42px',
		'text-indent': '10px',
		width: 'auto',
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
