import React, { Dispatch, SetStateAction, useState } from 'react';
import { ContentId, contentIdList } from '..';

export type ContentStore = {
	contentId: ContentId; setContentId: Dispatch<SetStateAction<ContentId>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContentContext = React.createContext<ContentStore>({} as any);

export const ContentConsumer = ContentContext.Consumer;

export type ContentProviderProps = {
	initContentId?: ContentId;
};

export const ContentProvider: React.FC<ContentProviderProps> = (props) => {
	const { children, initContentId } = props;

	const [contentId, setContentId] = useState<ContentId>(initContentId || contentIdList[0]);

	const value: ContentStore = {
		contentId,
		setContentId,
	};

	return (
		<ContentContext.Provider value={value}>
			{children}
		</ContentContext.Provider>
	);
};
