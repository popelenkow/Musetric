import { Theme, Locale } from "./types"

export const channels = {
	app: 'app',
	titlebar: 'titlebar',
	onWindow: 'on-window',
	pytest: 'pytest'
}

export type AppEvent =
	| { type: 'theme', theme: Theme }
	| { type: 'lng', lng: Locale }
export type TitlebarEvent = 'close' | 'minimize' | 'unmaximize' | 'maximize'