import React, { useState, useContext } from 'react';
import { i18n as I18n, TFunction } from 'i18next';

export type LocaleStore = {
	t: TFunction;
	localeId: string;
	setLocaleId: (id: string) => Promise<void>;
	localeIdList: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LocaleContext = React.createContext<LocaleStore>({} as any);

export const LocaleConsumer = LocaleContext.Consumer;

export type LocaleProviderProps = {
	i18n: I18n;
	localeIdList: string[];
};

export const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
	const { children, i18n, localeIdList } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	const store: LocaleStore = {
		t: (...args: Parameters<TFunction>) => i18n.t(...args),
		localeId,
		setLocaleId: async (id: string) => {
			await i18n.changeLanguage(id);
			setLocaleId(id);
		},
		localeIdList,
	};

	return (
		<LocaleContext.Provider value={store}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocale = () => useContext(LocaleContext);
