import { createUseStyles } from 'react-jss';

export const styles = {
	root: {
		'margin': '0',
		'padding': '0 12px',
		'border': '0',
		'outline': '0',
		'userSelect': 'none',
		'color': 'var(--color__content)',
		'background': 'transparent',
		'&:hover': {
			background: 'rgba(128,128,128,.1)',
		},
		'path, rect, polygon': {
			fill: 'var(--color__content)',
		},
	},
};

export const useStyles = createUseStyles(styles, { name: 'Button' });
