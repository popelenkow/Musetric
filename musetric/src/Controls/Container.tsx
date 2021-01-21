import React from 'react';
import { createUseStyles } from 'react-jss';
import { theming, Theme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		flex: 1,
		overflow: 'hidden',
		margin: '6px',
		border: `1px solid ${theme.splitter}`,
		backgroundColor: theme.contentBg,
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'Container', theming });

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
