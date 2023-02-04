/* eslint-disable no-console */
export type Log = {
	info: (message?: string) => void,
	warn: (message?: string) => void,
	error: (message?: string) => void,
};
export const createConsoleLog = (): Log => {
	return {
		info: (message): void => {
			console.log(message);
		},
		warn: (message): void => {
			console.warn(message);
		},
		error: (message): void => {
			console.error(message);
		},
	};
};
