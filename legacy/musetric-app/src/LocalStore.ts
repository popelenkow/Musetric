export const getStorageLocaleId = (): string | undefined => {
    const localeId = localStorage.getItem('locale') ?? undefined;
    return localeId;
};
export const setStorageLocaleId = (localeId: string): void => {
    localStorage.setItem('locale', localeId);
};

export const getStorageThemeId = (): string | undefined => {
    const themeId = localStorage.getItem('theme') || undefined;
    return themeId;
};
export const setStorageThemeId = (themeId: string): void => {
    localStorage.setItem('theme', themeId);
};
