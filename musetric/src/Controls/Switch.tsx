import React, { useState } from 'react';
import { TFunction } from 'i18next';
import { AppCss, createUseClasses, useAppLocaleContext, getButtonClasses } from '..';

export const getSwitchClasses = (css: AppCss) => ({
	root: {
		...getButtonClasses(css).root,
	},
});

export const useSwitchClasses = createUseClasses('Switch', getSwitchClasses);

export type SwitchProps<T> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	view?: (id: T, t: TFunction) => JSX.Element | string;
	className?: string;
};
type Props<T> = React.PropsWithChildren<SwitchProps<T>>;

export function Switch<T>(props: Props<T>): JSX.Element {
	const { currentId, ids, view, set, className } = props;
	const classes = useSwitchClasses();
	const { t } = useAppLocaleContext();

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
}
