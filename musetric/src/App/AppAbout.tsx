import React, { ReactNode, FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useLocaleContext } from '../AppContexts/Locale';
import { getFieldClasses } from '../Controls/Field';

export const getAppAboutClasses = createClasses((css) => {
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
			width: '240px',
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
const useClasses = createUseClasses('AppAbout', getAppAboutClasses);

export type AppAboutProps = {
	appVersion: string;
	links?: ReactNode[];
};

export const AppAbout: FC<AppAboutProps> = (props) => {
	const { appVersion, links } = props;
	const classes = useClasses();
	const { t } = useLocaleContext();

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
				<div>{`${t('Musetric:version')} ${appVersion}`}</div>
				<div>{`${t('Musetric:licensed')}`}</div>
				<Links />
			</div>
		</div>
	);
};
