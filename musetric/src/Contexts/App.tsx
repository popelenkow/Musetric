import React from 'react';
import { AppElementProvider, AppElementProviderProps, ContentProvider, ContentProviderProps, LocaleProvider, LocaleProviderProps, ThemeProvider, ThemeProviderProps } from '..';

export type AppProviderProps =
	& AppElementProviderProps
	& ContentProviderProps
	& LocaleProviderProps
	& ThemeProviderProps;

export const AppProvider: React.FC<AppProviderProps> = (props) => {
	const { children } = props;

	return (
		<LocaleProvider {...props}>
			<ThemeProvider {...props}>
				<ContentProvider {...props}>
					<AppElementProvider {...props}>
						{children}
					</AppElementProvider>
				</ContentProvider>
			</ThemeProvider>
		</LocaleProvider>
	);
};
