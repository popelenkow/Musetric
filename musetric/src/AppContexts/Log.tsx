import React, { FC, useMemo, createContext } from 'react';
import { Log } from '../AppBase/Log';
import { WithChildren } from '../ReactUtils/WithChildren';
import { useInitializedContext } from '../ReactUtils/Context';

export type LogStore = {
	log: Log;
};
export const LogContext = createContext<LogStore | undefined>(undefined);

export type LogProviderProps = {
	log: Log;
};

export const LogProvider: FC<WithChildren<LogProviderProps>> = (props) => {
	const { children, log } = props;

	const store: LogStore = useMemo(() => ({ log }), [log]);

	return (
		<LogContext.Provider value={store}>
			{children}
		</LogContext.Provider>
	);
};

export const useLogContext = (): LogStore => useInitializedContext(LogContext, 'useLogContext');
