import { createUseStyles } from 'react-jss';
import { Theme, theming } from '..';

export const getScrollbarStyles = (theme: Theme) => ({
	root: {
		'& ::-webkit-scrollbar': {
			width: '15px',
		},
		'& ::-webkit-scrollbar-track': {
			background: theme.color.scrollbarTrack,
		},
		'& ::-webkit-scrollbar-corner': {
			background: theme.color.scrollbarTrack,
		},
		'& ::-webkit-scrollbar-thumb': {
			background: theme.color.scrollbarThumb,
			'&:hover': {
				background: theme.color.scrollbarThumbHover,
			},
			'&:active': {
				background: theme.color.scrollbarThumbActive,
			},
		},
	},
});

export const useScrollbarStyles = createUseStyles(getScrollbarStyles, { name: 'Scrollbar', theming });
