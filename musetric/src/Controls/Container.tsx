import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theming } from '..';

export const getContainerStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		flex: 1,
		overflow: 'hidden',
		margin: '6px',
		border: `1px solid ${theme.splitter}`,
		backgroundColor: theme.contentBg,
	},
});

export const useContainerStyles = createUseStyles(getContainerStyles, { name: 'Container', theming });

export type ContainerProps = {
};

export const Container: React.FC<ContainerProps> = (props) => {
	const { children } = props;
	const classes = useContainerStyles();

	return (
		<div className={classes.root}>
			{children}
		</div>
	);
};
