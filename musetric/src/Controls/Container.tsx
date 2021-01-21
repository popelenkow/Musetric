import React from 'react';
import { createUseStyles } from 'react-jss';

export const useStyles = createUseStyles({
	root: {
		display: 'flex',
		flex: 1,
		overflow: 'hidden',
		margin: '6px',
		border: '1px solid var(--color__splitter)',
		backgroundColor: 'var(--color__contentBg)',
	},
}, { name: 'Container' });

export type Props = {
};

export const View: React.FC<Props> = (props) => {
	const { children } = props;
	const classes = useStyles();

	return (
		<div className={classes.root}>
			{children}
		</div>
	);
};
