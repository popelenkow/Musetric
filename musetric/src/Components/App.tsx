import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Contexts } from '..';
import { theming, Theme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		border: `1px solid ${theme.splitter}`,
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.appBg,
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'App', theming });

type PureProps = {
	setAppElement: (x: HTMLElement | null) => void;
};

const PureView: React.FC<PureProps> = (props) => {
	const { children, setAppElement } = props;
	const classes = useStyles();

	return (
		<div ref={setAppElement} className={classes.root}>
			{children}
		</div>
	);
};

export type Props =
	& Contexts.Content.Props
	& Contexts.Locale.Props
	& Contexts.Theme.Props;

export const View: React.FC<Props> = (props) => {
	const { children } = props;

	const [appElement, setAppElement] = useState<HTMLElement>(document.body);

	const contextProps: Contexts.App.Props = {
		...props,
		appElement,
	};

	return (
		<Contexts.App.Provider {...contextProps}>
			<PureView setAppElement={(x) => x && setAppElement(x)}>
				{children}
			</PureView>
		</Contexts.App.Provider>
	);
};
