import { Theme } from "../../types";

export type TitlebarProps = {
	theme: {
		value: Theme;
		set: (theme: Theme) => void;
		next: (theme: Theme) => Theme;
		localize: (theme: Theme) => string
	}
};

export type TitlebarState = {
	theme: Theme;
	isMaximized: boolean;
};