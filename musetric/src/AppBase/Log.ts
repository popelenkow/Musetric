/* eslint-disable no-console */
export type Log = {
	info: (message: string) => void,
	warn: (message: string) => void,
	error: (message: string) => void,
};
export const createConsoleLog = (): Log => {
	return {
		info: (message) => {
			console.log(message);
		},
		warn: (message) => {
			console.warn(message);
		},
		error: (message) => {
			console.error(message);
		},
	};
};
