import React, { useState, useContext } from 'react';
import { i18n as I18n, TFunction } from 'i18next';

export type AppLocaleStore = {
	t: TFunction;
	localeId: string;
	setLocaleId: (id: string) => Promise<void>;
	localeIdList: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppLocaleContext = React.createContext<AppLocaleStore>({} as any);
export const AppLocaleConsumer = AppLocaleContext.Consumer;

export type AppLocaleProviderProps = {
	i18n: I18n;
	localeIdList: string[];
	onSetLocaleId: (localeId: string) => void;
};

export const AppLocaleProvider: React.FC<AppLocaleProviderProps> = (props) => {
	const { children, i18n, localeIdList, onSetLocaleId } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	const store: AppLocaleStore = {
		t: (...args: Parameters<TFunction>) => i18n.t(...args),
		localeId,
		setLocaleId: async (id: string) => {
			await i18n.changeLanguage(id);
			setLocaleId(id);
			onSetLocaleId(id);
		},
		localeIdList,
	};

	return (
		<AppLocaleContext.Provider value={store}>
			{children}
		</AppLocaleContext.Provider>
	);
};

export const useAppLocaleContext = () => useContext(AppLocaleContext);
