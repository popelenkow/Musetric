import React, { useState, useContext, useMemo, FC } from 'react';
import { i18n as I18n, WithT } from 'i18next';
import { LocaleEntry } from '../AppBase/Locale';
import { createContext } from './Context';
import { WithChildren } from '../Controls/utils';

export type LocaleStore = {
	i18n: WithT;
	localeId: string;
	setLocaleId: (id: string) => Promise<void>;
	allLocaleIds: string[];
};
export const LocaleContext = createContext<LocaleStore>();
export const LocaleConsumer = LocaleContext.Consumer;

export type LocaleProviderProps = {
	i18n: I18n;
	allLocaleEntries: LocaleEntry[];
	onLocaleId: (localeId: string) => void;
};

export const LocaleProvider: FC<WithChildren<LocaleProviderProps>> = (props) => {
	const { children, i18n, allLocaleEntries, onLocaleId } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	const store: LocaleStore = useMemo(() => ({
		i18n,
		localeId,
		setLocaleId: async (id: string) => {
			await i18n.changeLanguage(id);
			setLocaleId(id);
			onLocaleId(id);
		},
		allLocaleIds: allLocaleEntries.map((x) => x.localeId),
	}), [allLocaleEntries, i18n, localeId, onLocaleId]);

	return (
		<LocaleContext.Provider value={store}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocaleContext = (): LocaleStore => useContext(LocaleContext);
