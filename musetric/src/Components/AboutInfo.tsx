import React from 'react';
import { Theme, createUseClasses, getFieldClasses } from '..';

export const getAboutInfoClasses = (theme: Theme) => ({
	root: {
		...getFieldClasses(theme).root,
		width: '100%',
		height: '100%',
		'background-color': theme.color.app,
	},
	container: {
		width: 'auto',
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
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
