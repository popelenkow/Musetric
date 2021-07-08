import React from 'react';
import { AppCss, getFieldClasses } from '..';
import { createUseClasses } from './AppCssContext';

export const getAboutInfoClasses = (css: AppCss) => ({
	root: {
		...getFieldClasses(css).root,
		width: '100%',
		height: '100%',
		'background-color': css.theme.app,
	},
	container: {
		width: 'auto',
		height: 'auto',
		display: 'flex',
		'flex-direction': 'column',
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
