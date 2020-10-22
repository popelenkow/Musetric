import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export type Props<T = any> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	className?: string;
	localize?: (id: T, t: TFunction) => string;
};

export type State<T = any> = {
	id: T;
};

export const View = <T, >(props: React.PropsWithChildren<Props<T>>): JSX.Element => {
	const { currentId, ids, localize, set, className } = props;
	const { t } = useTranslation();

	const [id, setId] = useState(currentId);

	const next = () => {
		let index = ids.indexOf(id);
		index = (index + 1) % ids.length;
		const newId = ids[index];
		setId(newId);
		set(newId);
	};
	return (
		<button type='button' className={className} onClick={next}>
			{localize ? localize(id, t) : id}
		</button>
	);
};
