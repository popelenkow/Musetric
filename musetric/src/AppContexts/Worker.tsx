import React, { createContext } from 'react';
import { Workers } from '../AppBase/Worker';
import { SFC } from '../UtilityTypes/React';
import { useInitializedContext } from '../UtilsReact/Context';

export type WorkerStore = Workers;
export const WorkerContext = createContext<WorkerStore | undefined>(undefined);

export const WorkerConsumer = WorkerContext.Consumer;

export type WorkerProviderProps = {
	workers: Workers,
};

export const WorkerProvider: SFC<WorkerProviderProps, 'required'> = (props) => {
	const { children, workers } = props;

	const store: WorkerStore = workers;

	return (
		<WorkerContext.Provider value={store}>
			{children}
		</WorkerContext.Provider>
	);
};

export const useWorkerContext = (): WorkerStore => useInitializedContext(WorkerContext, 'useWorkerContext');
