import React, { ReactNode, FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getFieldClasses } from '../Controls/Field';

export const getAboutInfoClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	const { app } = css.theme;
	return {
		root: {
			...fieldClasses.root,
			width: '100%',
			height: '100%',
			'background-color': app,
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
	};
});
const useClasses = createUseClasses('AppAboutInfo', getAboutInfoClasses);

export type AppAboutInfoProps = {
	appVersion: string;
	links?: ReactNode[];
};

export const AppAboutInfo: FC<AppAboutInfoProps> = (props) => {
	const { appVersion, links } = props;
	const classes = useClasses();

	const noLinks = !links || links.length === 0;
	const Links: FC = () => {
		if (noLinks) return null;

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
