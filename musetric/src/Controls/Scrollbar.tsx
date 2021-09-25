import { createClasses } from '../AppContexts/Css';

export const getScrollbarClasses = createClasses((css) => {
	const { content } = css.theme;
	return {
		root: {
			'& ::-webkit-scrollbar': {
				width: '15px',
			},
			'& ::-webkit-scrollbar-track': {
				background: content,
			},
			'& ::-webkit-scrollbar-corner': {
				background: content,
			},
			'& ::-webkit-scrollbar-thumb': {
				background: content,
				'&:hover': {
					background: content,
				},
				'&:active': {
					background: content,
				},
			},
		},
	};
});
