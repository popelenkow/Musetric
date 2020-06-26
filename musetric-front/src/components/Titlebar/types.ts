import { Theme } from "../../types";

export type TitlebarProps = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export type TitlebarState = {
	isDark: boolean;
	isMaximized: boolean;
};