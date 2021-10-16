import React, { useState, ReactNode, PropsWithChildren } from 'react';
import { TFunction } from 'i18next';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { useLocaleContext } from '../AppContexts/Locale';
import { getButtonClasses } from './Button';

export const getSwitchClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	return {
		root: {
			...buttonClasses.root,
		},
	};
});
const useClasses = createUseClasses('Switch', getSwitchClasses);

export type SwitchProps<T> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	view?: (id: T, t: TFunction) => ReactNode;
	className?: string;
};
type Props<T> = PropsWithChildren<SwitchProps<T>>;
export function Switch<T>(props: Props<T>): React.ReactElement | null {
	const { currentId, ids, view, set, className } = props;
	const classes = useClasses();
	const { t } = useLocaleContext();

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
