import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { theming } from 'musetric/Contexts/Theme';
import { Ipc } from '../Ipc';

export const getStyles = () => ({
	root: {
		width: 'auto',
		height: 'auto',
	},
	top: {
		'-webkit-app-region': 'no-drag',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '5px',
	},
	bottom: {
		'-webkit-app-region': 'no-drag',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '5px',
	},
	left: {
		'-webkit-app-region': 'no-drag',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		width: '5px',
	},
	right: {
		'-webkit-app-region': 'no-drag',
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		width: '5px',
	},
});

export const useStyles = createUseStyles(getStyles(), { name: 'ResizeFrame', theming });

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [isMaximized, setIsMaximized] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		Ipc.onWindow.on((_event, arg) => {
			setIsMaximized(arg.isMaximized);
		});
	});

	return !isMaximized ? (
		<div className={classes.root}>
			<div className={classes.top} />
			<div className={classes.bottom} />
			<div className={classes.left} />
			<div className={classes.right} />
		</div>
	) : <div />;
};
