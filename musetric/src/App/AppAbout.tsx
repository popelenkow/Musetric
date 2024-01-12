import React, { ReactNode, useMemo } from 'react';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { useAppLocale } from './AppContext';
import { createUseClasses } from './AppCss';

const useClasses = createUseClasses('AppAbout', {
	root: {
		display: 'flex',
		margin: '0',
		outline: 'none',
		'font-family': 'Verdana, Arial, sans-serif',
		'box-sizing': 'border-box',
		'align-items': 'center',
		padding: '0 6px',
		'min-height': '42px',
		'font-size': '18px',
		'justify-content': 'center',
		border: '1px solid',
		'border-color': 'transparent',
		color: `var(${themeVariables.content})`,
		width: '100%',
		height: '100%',
		'background-color': `var(${themeVariables.background})`,
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
});

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
