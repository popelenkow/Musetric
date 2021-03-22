import React from 'react';
import { Theme, createUseClasses } from '..';

export const getAboutInfoClasses = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'background-color': theme.color.app,
	},
	container: {
		width: 'auto',
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
		font: '18px/24px "Segoe UI", Arial, sans-serif',
		'background-color': theme.color.app,
	},
});

export const useAboutInfoClasses = createUseClasses('AboutInfo', getAboutInfoClasses);

export type AboutInfoProps = {
};

export const AboutInfo: React.FC<AboutInfoProps> = () => {
	const appVersion = process.env.MUSETRIC_APP_VERSION || '???';
	const libVersion = process.env.MUSETRIC_VERSION || '???';
	const classes = useAboutInfoClasses();

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>{`Musetric App version ${appVersion}`}</div>
				<div>{`Musetric Library version ${libVersion}`}</div>
				<div>Musetric is MIT licensed</div>
				<div>Copyright © 2021 Vladlen Popelenkov</div>
			</div>
		</div>
	);
};
