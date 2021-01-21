import React, { useContext, ReactNodeArray } from 'react';
import { createUseStyles } from 'react-jss';
import { Contexts, Contents } from '..';
import { theming } from '../Contexts/Theme';

export const getStyles = () => ({
	root: {
		width: '100%',
		height: '100%',
	},
});

export const useStyles = createUseStyles(getStyles(), { name: 'Content', theming });

export type Props = {
	getIndex: (contentId?: Contents.ContentId) => number;
	children: ReactNodeArray;
};

export const View: React.FC<Props> = (props) => {
	const { getIndex, children } = props;
	const classes = useStyles();

	const { contentId } = useContext(Contexts.Content.Context);

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
