import React, { useContext, createContext, FC } from 'react';
import { Workers } from '../AppBase/Worker';

export type WorkerStore = Workers;
// eslint-disable-next-line
const defaultWorkerStore: WorkerStore = undefined as any;
export const WorkerContext = createContext<WorkerStore>(defaultWorkerStore);

export const WorkerConsumer = WorkerContext.Consumer;

export type WorkerProviderProps = {
	workers: Workers;
};

export const WorkerProvider: FC<WorkerProviderProps> = (props) => {
	const { children, workers } = props;

	const store: WorkerStore = { ...workers };

	return (
		<WorkerContext.Provider value={store}>
			{children}
		</WorkerContext.Provider>
	);
};

export const useWorkerContext = (): WorkerStore => useContext(WorkerContext);
