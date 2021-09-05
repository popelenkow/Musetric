import React, { useState, useContext, createContext, FC } from 'react';
import i18next, { i18n as I18n, TFunction } from 'i18next';
import { LocaleEntry } from '../AppBase/Locale';

export type LocaleStore = {
	t: TFunction;
	localeId: string;
	setLocaleId: (id: string) => Promise<void>;
	allLocaleIds: string[];
};

const defaultLocaleStore: LocaleStore = {
	t: (...args: Parameters<TFunction>) => i18next.t(...args),
	localeId: 'en',
	setLocaleId: async () => {},
	allLocaleIds: [],
};

export const LocaleContext = createContext<LocaleStore>(defaultLocaleStore);
export const LocaleConsumer = LocaleContext.Consumer;

export type LocaleProviderProps = {
	i18n: I18n;
	allLocaleEntries: LocaleEntry[];
	onSetLocaleId: (localeId: string) => void;
};

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
	const { children, i18n, allLocaleEntries, onSetLocaleId } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	const store: LocaleStore = {
		t: (...args: Parameters<TFunction>) => i18n.t(...args),
		localeId,
		setLocaleId: async (id: string) => {
			await i18n.changeLanguage(id);
			setLocaleId(id);
			onSetLocaleId(id);
		},
		allLocaleIds: allLocaleEntries.map(x => x.localeId),
	};

	return (
		<LocaleContext.Provider value={store}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocaleContext = () => useContext(LocaleContext);
