import React, { useState, ReactNode, PropsWithChildren, ReactElement } from 'react';
import { TFunction } from 'i18next';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { useLocaleContext } from '../AppContexts/Locale';
import { getButtonClasses, Button, ButtonProps } from './Button';

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
	kind?: 'simple' | 'icon';
	disabled?: boolean;
	primary?: boolean;
	rounded?: boolean;
};
type Props<T> = PropsWithChildren<SwitchProps<T>>;
export function Switch<T>(props: Props<T>): ReactElement | null {
	const {
		currentId, ids, view, set,
		kind, disabled, primary, rounded,
	} = props;
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

	const buttonProps: ButtonProps = {
		kind,
		disabled,
		primary,
		rounded,
		onClick: next,
		classNames: { root: classes.root },
	};
	return (
		<Button {...buttonProps}>
			{view ? view(id, t) : id}
		</Button>
	);
}
