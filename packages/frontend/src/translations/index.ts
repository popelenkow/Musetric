import i18next, { Resource } from 'i18next';
import en from './en.json';

export const resources: Resource = {
  en: { translation: en },
};

export const i18n = i18next;

export const initI18next = () =>
  i18next.init({
    resources,
    lng: 'en',
  });
