import React, { Dispatch, SetStateAction, useState } from 'react';
import { Types } from '..';

export type Store = {
	contentId?: Types.ContentId, setContentId?: Dispatch<SetStateAction<Types.ContentId>>,
	theme?: Types.Theme, setTheme?: Dispatch<SetStateAction<Types.Theme>>,
	locale?: Types.Locale, setLocale?: Dispatch<SetStateAction<Types.Locale>>,
}
export const Context = React.createContext<Store>({});

export const { Consumer } = Context;

export type Props = {
	initContentId: Types.ContentId;
	initTheme: Types.Theme;
	initLocale: Types.Locale;
}

export const Provider: React.FC<Props> = (props) => {
	const { children, initTheme, initContentId, initLocale } = props;

	const [contentId, setContentId] = useState<Types.ContentId>(initContentId);
	const [theme, setTheme] = useState<Types.Theme>(initTheme);
	const [locale, setLocale] = useState<Types.Locale>(initLocale);

	return (
		<Context.Provider value={{ contentId, setContentId, theme, setTheme, locale, setLocale }}>
			{children}
		</Context.Provider>
	);
};
