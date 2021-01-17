import React, { Dispatch, SetStateAction, useState } from 'react';
import { JssProvider } from 'react-jss';
import { Types } from '..';

export type Store = {
	appElement?: HTMLElement; setAppElement: Dispatch<SetStateAction<HTMLElement | undefined>>;
	contentId?: Types.ContentId; setContentId: Dispatch<SetStateAction<Types.ContentId | undefined>>;
	theme?: Types.Theme; setTheme: Dispatch<SetStateAction<Types.Theme | undefined>>;
	locale?: Types.Locale; setLocale: Dispatch<SetStateAction<Types.Locale | undefined>>;
};

export const Context = React.createContext<Store>({
	setAppElement: () => { },
	setContentId: () => { },
	setTheme: () => { },
	setLocale: () => { },
});

export const { Consumer } = Context;

export type Props = {
	initAppElement?: HTMLElement;
	initContentId?: Types.ContentId;
	initTheme?: Types.Theme;
	initLocale?: Types.Locale;
};

export const Provider: React.FC<Props> = (props) => {
	const { children, initAppElement, initTheme, initContentId, initLocale } = props;

	const [appElement, setAppElement] = useState<HTMLElement | undefined>(initAppElement);
	const [contentId, setContentId] = useState<Types.ContentId | undefined>(initContentId);
	const [theme, setTheme] = useState<Types.Theme | undefined>(initTheme);
	const [locale, setLocale] = useState<Types.Locale | undefined>(initLocale);

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
			<JssProvider generateId={(rule, sheet) => (sheet?.options?.classNamePrefix || '') + rule.key}>
				{children}
			</JssProvider>
		</Context.Provider>
	);
};
