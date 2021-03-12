import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme } from '..';
import { theming } from '../Contexts';

export const getAboutInfoStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		backgroundColor: theme.color.app,
	},
	container: {
		width: 'auto',
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
		font: '18px/24px "Segoe UI", Arial, sans-serif',
		backgroundColor: theme.color.app,
	},
});

export const useAboutInfoStyles = createUseStyles(getAboutInfoStyles, { name: 'AboutInfo', theming });

export type AboutInfoProps = {
};

export const AboutInfo: React.FC<AboutInfoProps> = () => {
	const appVersion = process.env.MUSETRIC_APP_VERSION;
	const libVersion = process.env.MUSETRIC_VERSION;
	const classes = useAboutInfoStyles();

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>{`Musetric App version ${appVersion || '???'}`}</div>
				<div>{`Musetric Library version ${libVersion || '???'}`}</div>
				<div>Musetric is MIT licensed</div>
				<div>Copyright © 2021 Vladlen Popelenkov</div>
			</div>
		</div>
	);
};
