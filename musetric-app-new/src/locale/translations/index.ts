import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';

const translationResources: Resource = {
    en: { translation: en },
    ru: { translation: ru },
};

export const initTranslations = async () => {
    await i18n
        .use(initReactI18next)
        .init({
            lng: 'en',
            fallbackLng: 'en',
            resources: translationResources,
        });
};
