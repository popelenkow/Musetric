import React, { FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { getFieldClasses } from '../Controls/Field';

export const getAppBarClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	const { divider: splitter, sidebar } = css.theme;
	return {
		root: {
			display: 'flex',
			'box-sizing': 'border-box',
			width: '100%',
			height: '100%',
			'column-gap': '4px',
			background: sidebar,
			padding: '3px',
			cursor: 'default',
			'align-items': 'center',
			'border-bottom': `1px solid ${splitter}`,
		},
		icon: {
			...fieldClasses.root,
			...fieldClasses.root['&.icon'],
			'max-width': '42px',
			'max-height': '42px',
			'flex-grow': '1',
		},
		text: {
			...fieldClasses.root,
			'justify-content': 'left',
			'flex-grow': '2',
			'user-select': 'none',
			'max-height': '42px',
			'text-indent': '10px',
			width: 'auto',
		},
	};
});
const useClasses = createUseClasses('AppBar', getAppBarClasses);

export type AppBarProps = {
};
export const AppBar: FC<AppBarProps> = (props) => {
	const { children } = props;
	const classes = useClasses();
	const { AppIcon } = useIconContext();

	return (
		<div className={classes.root}>
			<div className={classes.icon}><AppIcon /></div>
			<div className={classes.text}>Musetric</div>
			{children}
		</div>
	);
};
