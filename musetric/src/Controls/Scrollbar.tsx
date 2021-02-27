import { createUseStyles } from 'react-jss';
import { Theme, theming } from '..';

export const getScrollbarStyles = (theme: Theme) => ({
	root: {
		'& ::-webkit-scrollbar': {
			width: '15px',
		},
		'& ::-webkit-scrollbar-track': {
			background: theme.scrollbarTrack,
		},
		'& ::-webkit-scrollbar-corner': {
			background: theme.scrollbarTrack,
		},
		'& ::-webkit-scrollbar-thumb': {
			background: theme.scrollbarThumb,
			'&:hover': {
				background: theme.scrollbarThumbHover,
			},
			'&:active': {
				background: theme.scrollbarThumbActive,
			},
		},
	},
});

export const useScrollbarStyles = createUseStyles(getScrollbarStyles, { name: 'Scrollbar', theming });
