import React, { ReactNode, FC, useCallback } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useLocaleContext } from '../AppContexts/Locale';
import { getFieldClasses } from '../Controls/Field';

export const getAppAboutClasses = createClasses((css) => {
	const { theme } = css;
	const fieldClasses = getFieldClasses(css);
	return {
		root: {
			...fieldClasses.root,
			width: '100%',
			height: '100%',
			'background-color': theme.background,
		},
		container: {
			width: '280px',
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
	const { i18n } = useLocaleContext();

	const noLinks = !links || links.length === 0;
	const Links = useCallback<FC>(() => {
		if (noLinks) return null;

		return (
			<div className={classes.links}>
				{links}
			</div>
		);
	}, [classes, links, noLinks]);

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>Musetric</div>
				<div>{`${i18n.t('AppBase:version')} ${appVersion}`}</div>
				<div>{`${i18n.t('AppBase:licensed')}`}</div>
				<Links />
			</div>
		</div>
	);
};
