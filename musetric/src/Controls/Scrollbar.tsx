import { Theme, createUseClasses } from '..';

export const getScrollbarClasses = (theme: Theme) => ({
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

export const useScrollbarClasses = createUseClasses('Scrollbar', getScrollbarClasses);
