import React, { useState, useMemo, createContext } from 'react';
import { I18n, LocaleEntry } from '../AppBase/Locale';
import { useInitializedContext } from '../ReactUtils/Context';
import { SFC } from '../UtilityTypes';

export type LocaleStore = {
	i18n: I18n,
	localeId: string,
	setLocaleId: (id: string) => Promise<void>,
	allLocaleIds: string[],
};
export const LocaleContext = createContext<LocaleStore | undefined>(undefined);

export type LocaleProviderProps = {
	i18n: I18n,
	allLocaleEntries: LocaleEntry[],
	onLocaleId: (localeId: string) => void,
};

export const LocaleProvider: SFC<LocaleProviderProps, 'required'> = (props) => {
	const { children, i18n, allLocaleEntries, onLocaleId } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	const store: LocaleStore = useMemo(() => ({
		i18n,
		localeId,
		setLocaleId: async (id: string): Promise<void> => {
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
LocaleProvider.displayName = 'LocaleProvider';

export const useLocaleContext = (): LocaleStore => useInitializedContext(LocaleContext, 'useLocaleContext');
