import React, { useContext, ReactNodeArray } from 'react';
import { createUseStyles } from 'react-jss';
import { ContentContext, ContentId, theming } from '..';

export const getContentStyles = () => ({
	root: {
		width: '100%',
		height: '100%',
	},
});

export const useContentStyles = createUseStyles(getContentStyles(), { name: 'Content', theming });

export type ContentProps = {
	getIndex: (contentId?: ContentId) => number;
	children: ReactNodeArray;
};

export const Content: React.FC<ContentProps> = (props) => {
	const { getIndex, children } = props;
	const classes = useContentStyles();

	const { contentId } = useContext(ContentContext);

	const index = getIndex(contentId);

	if (index === -1) {
		return <div>none</div>;
	}

	return (
		<div className={classes.root}>
			{children[index]}
		</div>
	);
};
