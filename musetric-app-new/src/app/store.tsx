import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppLocale } from '../locale/types';

export type AppStore = {
    locale: AppLocale,
    setLocale: (locale: AppLocale) => void,
};

export const useAppStore = create(persist<AppStore>((set) => ({
    locale: 'en',
    setLocale: (locale) => set({ locale }),
}), {
    name: 'appStore',
}));
