/* eslint-disable @typescript-eslint/comma-dangle */
import React, { useState } from 'react';
import { TFunction } from 'i18next';
import { createUseStyles } from 'react-jss';
import { theming } from '../Contexts';
import { Theme, useLocale } from '..';
import { getButtonStyles } from './Button';

export const getSwitchStyles = (theme: Theme) => ({
	root: {
		...getButtonStyles(theme).root,
	},
});

export const useSwitchStyles = createUseStyles(getButtonStyles, { name: 'Switch', theming });

export type SwitchProps<T> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	view?: (id: T, t: TFunction) => JSX.Element | string;
	className?: string;
};

export type SwitchState<T> = {
	id: T;
};

export const Switch = <T, >(props: React.PropsWithChildren<SwitchProps<T>>): JSX.Element => {
	const { currentId, ids, view, set, className } = props;
	const classes = useSwitchStyles();
	const { t } = useLocale();

	const [id, setId] = useState(currentId);

	const next = () => {
		let index = ids.indexOf(id);
		index = (index + 1) % ids.length;
		const newId = ids[index];
		setId(newId);
		set(newId);
	};

	return (
		<button type='button' className={className || classes.root} onClick={next}>
			{view ? view(id, t) : id}
		</button>
	);
};
