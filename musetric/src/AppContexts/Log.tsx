import React, { useContext, FC, useMemo } from 'react';
import { Log } from '../AppBase/Log';
import { createContext } from './Context';

export type LogStore = {
	log: Log;
};
export const LogContext = createContext<LogStore>();

export type LogProviderProps = {
	log: Log;
};

export const LogProvider: FC<LogProviderProps> = (props) => {
	const { children, log } = props;

	const store: LogStore = useMemo(() => ({ log }), [log]);

	return (
		<LogContext.Provider value={store}>
			{children}
		</LogContext.Provider>
	);
};

export const useLogContext = (): LogStore => useContext(LogContext);
