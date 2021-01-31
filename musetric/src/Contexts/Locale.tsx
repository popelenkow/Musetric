import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { i18n as I18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

export type LocaleStore = {
	localeId: string;
	setLocaleId: Dispatch<SetStateAction<string>>;
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

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		i18n.changeLanguage(localeId);
	}, [localeId, i18n]);

	const store: LocaleStore = {
		localeId,
		setLocaleId,
		localeIdList,
	};

	return (
		<LocaleContext.Provider value={store}>
			<I18nextProvider i18n={i18n}>
				{children}
			</I18nextProvider>
		</LocaleContext.Provider>
	);
};
