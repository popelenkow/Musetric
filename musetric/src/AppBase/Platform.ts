export type PlatformId = 'desktop' | 'mobile';

export const getPlatformId = (): PlatformId => {
    const detectMobile = (): boolean => {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
        ];

        return toMatch.some((toMatchItem) => {
            return toMatchItem.exec(navigator.userAgent);
        });
    };
    return detectMobile() ? 'mobile' : 'desktop';
};
