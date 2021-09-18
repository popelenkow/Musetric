import React, { FC } from 'react';
import { createUseClasses, Css } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { getFieldClasses } from '../Controls/Field';

export const getAppTitlebarClasses = (css: Css) => {
	const fieldClasses = getFieldClasses(css);
	const { splitter, sidebar } = css.theme;
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
			'flex-grow': '1',
			'max-width': '42px',
			'max-height': '42px',
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
};
const useClasses = createUseClasses('AppTitlebar', getAppTitlebarClasses);

export type AppTitlebarProps = {
};
export const AppTitlebar: FC<AppTitlebarProps> = (props) => {
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
