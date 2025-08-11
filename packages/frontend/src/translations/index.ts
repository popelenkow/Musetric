import i18next, { Resource } from 'i18next';
import en from './en.json';

export const resources: Resource = {
  en: { translation: en },
};

export const i18n = i18next;

export const initI18next = async () => {
  const queries = new URLSearchParams(window.location.search);
  const lng = queries.get('lng') ?? 'en';
  return i18next.init({
    resources,
    lng,
  });
};
