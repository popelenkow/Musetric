export type PlatformThemeId = 'desktop' | 'mobile';

export type PlatformTheme = {
	id: PlatformThemeId,
	height: string;
	width: string;
};

export const getPlatformId = (): PlatformThemeId => {
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
