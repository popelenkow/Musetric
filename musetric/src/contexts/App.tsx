import React, { Dispatch, SetStateAction, useState } from 'react';
import { Types } from '..';

export type Store = {
	appElement?: HTMLElement; setAppElement?: Dispatch<SetStateAction<HTMLElement>>;
	contentId?: Types.ContentId; setContentId?: Dispatch<SetStateAction<Types.ContentId>>;
	theme?: Types.Theme; setTheme?: Dispatch<SetStateAction<Types.Theme>>;
	locale?: Types.Locale; setLocale?: Dispatch<SetStateAction<Types.Locale>>;
};

export const Context = React.createContext<Store>({});

export const { Consumer } = Context;

export type Props = {
	initAppElement: HTMLElement;
	initContentId: Types.ContentId;
	initTheme: Types.Theme;
	initLocale: Types.Locale;
};

export const Provider: React.FC<Props> = (props) => {
	const { children, initAppElement, initTheme, initContentId, initLocale } = props;

	const [appElement, setAppElement] = useState<HTMLElement>(initAppElement);
	const [contentId, setContentId] = useState<Types.ContentId>(initContentId);
	const [theme, setTheme] = useState<Types.Theme>(initTheme);
	const [locale, setLocale] = useState<Types.Locale>(initLocale);

	const value: Store = {
		appElement,
		setAppElement,
		contentId,
		setContentId,
		theme,
		setTheme,
		locale,
		setLocale,
	};

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	);
};
