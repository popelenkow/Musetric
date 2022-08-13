import React, { useMemo, createContext } from 'react';
import { Log } from '../AppBase/Log';
import { useInitializedContext } from '../ReactUtils/Context';
import { SFC } from '../UtilityTypes';

export type LogStore = {
	log: Log,
};
export const LogContext = createContext<LogStore | undefined>(undefined);

export type LogProviderProps = {
	log: Log,
};

export const LogProvider: SFC<LogProviderProps, 'required'> = (props) => {
	const { children, log } = props;

	const store: LogStore = useMemo(() => ({ log }), [log]);

	return (
		<LogContext.Provider value={store}>
			{children}
		</LogContext.Provider>
	);
};
LogProvider.displayName = 'LogProvider';

export const useLogContext = (): LogStore => useInitializedContext(LogContext, 'useLogContext');
