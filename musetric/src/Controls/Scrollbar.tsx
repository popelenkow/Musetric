import { createUseClasses, Css } from '../AppContexts/CssContext';

export const getScrollbarClasses = (css: Css) => ({
	root: {
		'& ::-webkit-scrollbar': {
			width: '15px',
		},
		'& ::-webkit-scrollbar-track': {
			background: css.theme.content,
		},
		'& ::-webkit-scrollbar-corner': {
			background: css.theme.content,
		},
		'& ::-webkit-scrollbar-thumb': {
			background: css.theme.content,
			'&:hover': {
				background: css.theme.content,
			},
			'&:active': {
				background: css.theme.content,
			},
		},
	},
});

export const useScrollbarClasses = createUseClasses('Scrollbar', getScrollbarClasses);
