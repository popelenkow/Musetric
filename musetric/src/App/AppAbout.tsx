import React, { ReactNode, useMemo } from 'react';
import { getFieldClasses } from '../Controls/Field';
import { SFC } from '../UtilityTypes/React';
import { useAppLocale } from './AppContext';
import { createUseClasses, createClasses } from './AppCss';

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
	appVersion: string,
	links?: ReactNode[],
};
export const AppAbout: SFC<AppAboutProps> = (props) => {
	const { appVersion, links } = props;
	const classes = useClasses();
	const { i18n } = useAppLocale();

	const linksElement = useMemo(() => {
		const noLinks = !links || links.length === 0;
		if (noLinks) return null;

		return (
			<div className={classes.links}>
				{links}
			</div>
		);
	}, [classes, links]);

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>Musetric</div>
				<div>{`${i18n.t('AppBase:version')} ${appVersion}`}</div>
				<div>{`${i18n.t('AppBase:licensed')}`}</div>
				{linksElement}
			</div>
		</div>
	);
};
