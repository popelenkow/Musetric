import React, { Dispatch, SetStateAction, useState } from 'react';
import { ContentId, contentIdList } from '../Contents';

export type Store = {
	contentId: ContentId; setContentId: Dispatch<SetStateAction<ContentId>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Context = React.createContext<Store>({} as any);

export const { Consumer } = Context;

export type Props = {
	initContentId?: ContentId;
};

export const Provider: React.FC<Props> = (props) => {
	const { children, initContentId } = props;

	const [contentId, setContentId] = useState<ContentId>(initContentId || contentIdList[0]);

	const value: Store = {
		contentId,
		setContentId,
	};

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	);
};
