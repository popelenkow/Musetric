import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from 'musetric/Controls';
import { theming, Theme } from 'musetric/Contexts/Theme';
import { Ipc } from '../Ipc';

export const getStyles = (theme: Theme) => {
	const windowsTitlebarButton = {
		...Button.getStyles(theme).root,
		'-webkit-app-region': 'none',
		width: '48px',
		height: '32px',
		'& svg': {
			width: '10px',
			height: '10px',
		},
	};
	return ({
		root: {
			maxWidth: '144px',
			maxHeight: '32px',
			flexGrow: 1,
		},
		button: {
			...windowsTitlebarButton,
		},
		closeButton: {
			...windowsTitlebarButton,
			'&:hover': {
				background: '#e81123',
			},
		},
	});
};

export const useStyles = createUseStyles(getStyles, { name: 'WindowsTitlebar', theming });

export const Icons = {
	minimize: <svg x='0px' y='0px' viewBox='0 0 10.2 1'><rect x='0' y='50%' width='10.2' height='1' /></svg>,
	maximize: <svg viewBox='0 0 10 10'><path d='M0,0v10h10V0H0z M9,9H1V1h8V9z' /></svg>,
	unmaximize: <svg viewBox='0 0 10.2 10.1'><path d='M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z' /></svg>,
	close: <svg viewBox='0 0 10 10'><polygon points='10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1' /></svg>,
};

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [isMaximized, setIsMaximized] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		Ipc.onWindow.on((_event, arg) => {
			setIsMaximized(arg.isMaximized);
		});
	}, []);

	return (
		<div className={classes.root}>
			<button type='button' className={classes.button} onClick={() => Ipc.titlebar.invoke('minimize')}>
				{Icons.minimize}
			</button>
			<button type='button' className={classes.button} onClick={() => (isMaximized ? Ipc.titlebar.invoke('unmaximize') : Ipc.titlebar.invoke('maximize'))}>
				{isMaximized ? Icons.unmaximize : Icons.maximize}
			</button>
			<button type='button' className={classes.closeButton} onClick={() => Ipc.titlebar.invoke('close')}>
				{Icons.close}
			</button>
		</div>
	);
};
