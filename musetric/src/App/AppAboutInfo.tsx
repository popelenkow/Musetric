import React, { ReactNode, FC } from 'react';
import { createUseClasses, Css } from '../AppContexts/Css';
import { getFieldClasses } from '../Controls/Field';

export const getAboutInfoClasses = (css: Css) => ({
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
	links: {
		display: 'flex',
		'flex-direction': 'row',
	},
});

export const useAboutInfoClasses = createUseClasses('AppAboutInfo', getAboutInfoClasses);

export type AppAboutInfoProps = {
	appVersion: string;
	links?: ReactNode[];
};

export const AppAboutInfo: FC<AppAboutInfoProps> = (props) => {
	const { appVersion, links } = props;
	const classes = useAboutInfoClasses();

	const Links: FC = () => {
		if (!links || links.length === 0) return null;
		return (
			<div className={classes.links}>
				{links}
			</div>
		);
	};
	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>Musetric</div>
				<div>{`Version ${appVersion}`}</div>
				<div>This software is MIT licensed</div>
				<Links />
			</div>
		</div>
	);
};
