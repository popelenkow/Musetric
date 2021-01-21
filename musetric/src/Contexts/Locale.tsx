import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { i18n as I18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

export type Store = {
	localeId: string;
	setLocaleId: Dispatch<SetStateAction<string>>;
	localeIdList: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Context = React.createContext<Store>({} as any);

export const { Consumer } = Context;

export type Props = {
	i18n: I18n;
	localeIdList: string[];
};

export const Provider: React.FC<Props> = (props) => {
	const { children, i18n, localeIdList } = props;

	const [localeId, setLocaleId] = useState<string>(i18n.language);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		i18n.changeLanguage(localeId);
	}, [localeId, i18n]);

	const store: Store = {
		localeId,
		setLocaleId,
		localeIdList,
	};

	return (
		<Context.Provider value={store}>
			<I18nextProvider i18n={i18n}>
				{children}
			</I18nextProvider>
		</Context.Provider>
	);
};
