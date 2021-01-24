import { createUseStyles } from 'react-jss';
import { theming, Theme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
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

export const useStyles = createUseStyles(getStyles, { name: 'Scrollbar', theming });
