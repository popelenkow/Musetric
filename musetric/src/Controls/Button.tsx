import { createUseStyles } from 'react-jss';
import { theming, Theme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		margin: '0',
		padding: '0 12px',
		border: '0',
		outline: '0',
		userSelect: 'none',
		color: theme.content,
		background: 'transparent',
		'&:hover': {
			background: 'rgba(128,128,128,.1)',
		},
		'& path, rect, polygon': {
			fill: theme.content,
		},
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'Button', theming });
