import { createUseStyles } from 'react-jss';

export const styles = {
	root: {
		'& ::-webkit-scrollbar': {
			width: '15px',
		},
		'& ::-webkit-scrollbar-track': {
			background: 'var(--color__scrollbarTrack)',
		},
		'& ::-webkit-scrollbar-corner': {
			background: 'var(--color__scrollbarTrack)',
		},
		'& ::-webkit-scrollbar-thumb': {
			'background': 'var(--color__scrollbarThumb)',
			'&:hover': {
				background: 'var(--color__scrollbarThumb--hover)',
			},
			'&:active': {
				background: 'var(--color__scrollbarThumb--active)',
			},
		},
	},
};

export const useStyles = createUseStyles(styles, { name: 'Scrollbar' });
