import React, { FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { getFieldClasses } from '../Controls/Field';
import { WithChildren } from '../ReactUtils/WithChildren';

export const getAppBarClasses = createClasses((css) => {
	const { theme } = css;
	const fieldClasses = getFieldClasses(css);
	return {
		root: {
			display: 'flex',
			'box-sizing': 'border-box',
			width: '100%',
			height: '100%',
			'column-gap': '4px',
			background: theme.activeBackground,
			padding: '0px 4px',
			'align-items': 'center',
			'justify-content': 'center',
			'border-bottom': `1px solid ${theme.divider}`,
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
			width: 'auto',
		},
	};
});
const useClasses = createUseClasses('AppBar', getAppBarClasses);

export const AppBar: FC<WithChildren> = (props) => {
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
