import React, { FC, useContext } from 'react';
import { Workers } from '../AppBase/Worker';
import { WithChildren } from '../Controls/utils';
import { createContext } from './Context';

export type WorkerStore = Workers;
export const WorkerContext = createContext<WorkerStore>();

export const WorkerConsumer = WorkerContext.Consumer;

export type WorkerProviderProps = {
	workers: Workers;
};

export const WorkerProvider: FC<WithChildren<WorkerProviderProps>> = (props) => {
	const { children, workers } = props;

	const store: WorkerStore = workers;

	return (
		<WorkerContext.Provider value={store}>
			{children}
		</WorkerContext.Provider>
	);
};

export const useWorkerContext = (): WorkerStore => useContext(WorkerContext);
