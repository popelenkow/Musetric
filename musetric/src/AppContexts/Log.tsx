import React, { useMemo, createContext, ReactElement, ReactNode } from 'react';
import { Log } from '../AppBase/Log';
import { useInitializedContext } from '../ReactUtils/Context';

export type LogStore = {
	log: Log,
};
export const LogContext = createContext<LogStore | undefined>(undefined);

export type LogProviderProps = {
	log: Log,
};

export function LogProvider(
	props: LogProviderProps & { children: ReactNode },
): ReactElement {
	const { children, log } = props;

	const store: LogStore = useMemo(() => ({ log }), [log]);

	return (
		<LogContext.Provider value={store}>
			{children}
		</LogContext.Provider>
	);
}

export const useLogContext = (): LogStore => useInitializedContext(LogContext, 'useLogContext');
