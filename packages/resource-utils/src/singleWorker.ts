import { createCallLatest } from './callLatest.js';
import { createScheduler, Scheduler } from './scheduler.js';

export type TaskRunner = () => Promise<void>;
export type GetNextTask = () => Promise<TaskRunner | undefined>;

export type CreateSingleWorkerOptions = {
  intervalMs: number;
  getNextTask: GetNextTask;
};

export type SingleWorker = Scheduler;

export const createSingleWorker = (
  options: CreateSingleWorkerOptions,
): SingleWorker => {
  const { intervalMs, getNextTask } = options;

  const run = async () => {
    try {
      const task = await getNextTask();
      if (!task) {
        return;
      }
      await task();
    } catch {
      return;
    }
  };

  return createScheduler(createCallLatest(run), intervalMs);
};
