import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { useTranslation } from 'react-i18next';
import { Types, Locales, Contexts, Controls } from '..';

export const useStyles = createUseStyles({
	root: {
		'display': 'flex',
		'width': '100%',
		'height': '32px',
		'background': 'var(--color__sidebarBg)',
		'cursor': 'default',
		'-webkit-app-region': 'drag',
		'-webkit-user-select': 'none',
		'border-bottom': '1px solid var(--color__splitter)',
	},
	icon: {
		'flexGrow': '1',
		'maxWidth': '32px',
		'maxHeight': '32px',
		'& path': {
			fill: 'var(--color__icon)',
		},
	},
	text: {
		flexGrow: '2',
		maxHeight: '32px',
		width: 'auto',
		font: '12px/32px "Segoe UI", Arial, sans-serif',
		color: 'var(--color__content)',
		textIndent: '10px',
	},
	button: {
		'-webkit-app-region': 'none',
		...Controls.Button.styles.root,
	},
}, { name: 'Titlebar' });

export const Icons = {
	app: <svg width='32' height='32' viewBox='0 0 135.47 135.47'><g transform='translate(0 -161.53)'><path transform='matrix(.26458 0 0 .26458 0 161.53)' d='m256 56a200 200 0 0 0-200 200 200 200 0 0 0 54.283 136.78 33.75 48.214 75 0 1-3.0781-6.8164 33.75 48.214 75 0 1 37.836-45.078 33.75 48.214 75 0 1 23.975-1.9082v-204.4l192.58-48.145a200 200 0 0 0-105.59-30.436zm105.87 30.607v240.83l-0.02344 0.00586a33.75 48.214 75 0 1-38.629 38.645 33.75 48.214 75 0 1-55.307-20.121 33.75 48.214 75 0 1 37.836-45.078 33.75 48.214 75 0 1 23.982-1.9082v-150.11l-128.57 32.145v26.498h-0.00196v160.11l-0.00781 0.00196a33.75 48.214 75 0 1-38.639 38.471 33.75 48.214 75 0 1-43.609-4.8106 200 200 0 0 0 137.1 54.723 200 200 0 0 0 200-200 200 200 0 0 0-94.127-169.39z' /></g></svg>,
};

export type Props = {
};

export const View: React.FC<Props> = (props) => {
	const { children } = props;
	const classes = useStyles();
	const { i18n } = useTranslation();

	const {
		appElement,
		contentId, setContentId,
		theme, setTheme,
		locale, setLocale,
	} = useContext(Contexts.App.Context);

	const contentSwitchProps: Controls.Switch.Props<Types.ContentId> = {
		currentId: contentId || Types.contentSet[0],
		ids: Types.contentSet,
		set: (id) => setContentId(id),
		className: classes.button,
		localize: (id) => id,
	};

	const themeSwitchProps: Controls.Switch.Props<Types.Theme> = {
		currentId: theme || Types.themeSet[0],
		ids: Types.themeSet,
		set: (id) => {
			const app = appElement || document.body;
			app.classList.forEach(x => Types.isTheme(x) && app.classList.remove(x));
			app.classList.add(id);
			setTheme(id);
		},
		className: classes.button,
		localize: (id, t) => Locales.localizeTheme(id, t) || id,
	};

	const localeSwitchProps: Controls.Switch.Props<Types.Locale> = {
		currentId: locale || Types.localeSet[0],
		ids: Types.localeSet,
		set: (id) => {
			setLocale(id);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			i18n.changeLanguage(id);
		},
		className: classes.button,
		localize: (id, t) => Locales.localizeLocale(id, t) || id,
	};

	return (
		<div className={classes.root}>
			<div className={classes.icon}>{Icons.app}</div>
			<div className={classes.text}>Musetric</div>
			<Controls.Switch.View {...contentSwitchProps} />
			<Controls.Switch.View {...themeSwitchProps} />
			<Controls.Switch.View {...localeSwitchProps} />
			{children}
		</div>
	);
};
