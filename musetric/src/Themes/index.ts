import { ColorTheme } from './Color';
import { PlatformTheme } from './Platform';

export type Theme = {
	color: ColorTheme;
	platform: PlatformTheme;
};

export * from './Color';
export * from './Platform';
