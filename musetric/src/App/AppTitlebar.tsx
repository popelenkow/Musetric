import React from 'react';
import { Theme, AppIcon, getFieldClasses } from '..';
import { createUseClasses } from './Theme';

export const getAppTitlebarClasses = (theme: Theme) => ({
	root: {
		display: 'flex',
		'box-sizing': 'border-box',
		width: '100%',
		height: '100%',
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
