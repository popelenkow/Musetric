/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

type TimeRange = {
  start?: number;
  end?: number;
};

const getDuration = (range: TimeRange): number => {
  const { start, end } = range;
  if (start === undefined || end === undefined) {
    return 0;
  }
  const duration = end - start;
  return Math.round(duration * 1e3) / 1e3;
};

export type CpuTimer<Label extends string> = {
  start: (label: Label) => void;
  end: (label: Label) => void;
  wrap: <T extends (...args: any[]) => any>(label: Label, fn: T) => T;
  wrapAsync: <T extends (...args: any[]) => Promise<any>>(
    label: Label,
    fn: T,
  ) => T;
  read: () => Record<Label, number>;
};

export const createCpuTimer = <Labels extends readonly string[]>(
  labels: [...Labels],
): CpuTimer<Labels[number]> => {
  type Label = Labels[number];

  const ranges = labels.reduce(
    (acc, label) => {
      acc[label] = {};
      return acc;
    },
    {} as Record<Label, TimeRange>,
  );

  return {
    start: (label) => {
      ranges[label].start = performance.now();
    },
    end: (label) => {
      ranges[label].end = performance.now();
    },
    wrap: (label, fn) => {
      const wrapped = (...args: Parameters<typeof fn>) => {
        try {
          ranges[label].start = performance.now();
          return fn(...args);
        } finally {
          ranges[label].end = performance.now();
        }
      };
      return wrapped as typeof fn;
    },
    wrapAsync: (label, fn) => {
      const wrapped = async (...args: Parameters<typeof fn>) => {
        try {
          ranges[label].start = performance.now();
          return await fn(...args);
        } finally {
          ranges[label].end = performance.now();
        }
      };
      return wrapped as typeof fn;
    },
    read: () =>
      labels.reduce(
        (acc, label) => {
          const range = ranges[label];
          acc[label] = getDuration(range);
          range.start = undefined;
          range.end = undefined;
          return acc;
        },
        {} as Record<Label, number>,
      ),
  };
};
