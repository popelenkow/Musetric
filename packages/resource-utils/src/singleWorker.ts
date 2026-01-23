import { createCallLatest } from './callLatest.js';
import { createScheduler, Scheduler } from './scheduler.js';

export type CreateSingleWorkerOptions = {
  intervalMs: number;
  runNext: () => Promise<void>;
};

export type SingleWorker = Scheduler;

export const createSingleWorker = (
  options: CreateSingleWorkerOptions,
): SingleWorker => {
  const { intervalMs, runNext } = options;

  const run = async () => {
    try {
      await runNext();
    } catch {
      return;
    }
  };

  return createScheduler(createCallLatest(run), intervalMs);
};
