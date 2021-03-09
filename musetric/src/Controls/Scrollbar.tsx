import { createUseStyles } from 'react-jss';
import { Theme, theming } from '..';

export const getScrollbarStyles = (theme: Theme) => ({
	root: {
		'& ::-webkit-scrollbar': {
			width: '15px',
		},
		'& ::-webkit-scrollbar-track': {
			background: theme.color.content,
		},
		'& ::-webkit-scrollbar-corner': {
			background: theme.color.content,
		},
		'& ::-webkit-scrollbar-thumb': {
			background: theme.color.content,
			'&:hover': {
				background: theme.color.content,
			},
			'&:active': {
				background: theme.color.content,
			},
		},
	},
});

export const useScrollbarStyles = createUseStyles(getScrollbarStyles, { name: 'Scrollbar', theming });
