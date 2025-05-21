import { LocaleEntry } from 'musetric/AppBase/Locale';
import commonEn from 'musetric/Resources/Locales/en';
import commonRu from 'musetric/Resources/Locales/ru';
import en from './en';
import ru from './ru';

export const allLocaleEntries: LocaleEntry[] = [
    { localeId: 'en', localeResource: { ...commonEn, ...en } },
    { localeId: 'ru', localeResource: { ...commonRu, ...ru } },
];
