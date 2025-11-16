import { api } from '@musetric/api';
import { TFunction } from 'i18next';
import {
  StageItem,
  StageKey,
  StageStatus,
  clampPercent,
} from './stageTypes.js';

type StageDefinition = {
  key: StageKey;
  title: string;
  description: string;
};

type StageState = {
  status: StageStatus;
  percent?: number;
};

const stageWeights: Record<StageKey, number> = {
  queue: 1,
  warmup: 1,
  processing: 1,
  delivery: 1,
};
const stageOrder: StageKey[] = ['queue', 'warmup', 'processing', 'delivery'];

const getStageDefinitions = (t: TFunction): StageDefinition[] => [
  {
    key: 'queue',
    title: t('pages.project.progress.steps.queue.label'),
    description: t('pages.project.progress.steps.queue.description'),
  },
  {
    key: 'warmup',
    title: t('pages.project.progress.steps.warmup.label'),
    description: t('pages.project.progress.steps.warmup.description'),
  },
  {
    key: 'processing',
    title: t('pages.project.progress.steps.processing.label'),
    description: t('pages.project.progress.steps.processing.description'),
  },
  {
    key: 'delivery',
    title: t('pages.project.progress.steps.delivery.label'),
    description: t('pages.project.progress.steps.delivery.description'),
  },
];

const resolveStageStates = (
  project: api.project.Item,
): Record<StageKey, StageState> => {
  const normalizedProgress =
    project.stage === 'done'
      ? 1
      : Math.min(1, Math.max(0, project.separationProgress ?? 0));
  const processingPercent =
    project.stage === 'progress' && normalizedProgress > 0
      ? clampPercent(normalizedProgress * 100)
      : project.stage === 'done'
        ? 100
        : undefined;

  return {
    queue: { status: project.stage === 'pending' ? 'active' : 'done' },
    warmup: {
      status:
        project.stage === 'pending'
          ? 'waiting'
          : normalizedProgress === 0 && project.stage === 'progress'
            ? 'active'
            : 'done',
    },
    processing: {
      status:
        project.stage === 'progress' &&
        normalizedProgress > 0 &&
        normalizedProgress < 1
          ? 'active'
          : project.stage === 'done' || normalizedProgress >= 1
            ? 'done'
            : 'waiting',
      percent: processingPercent,
    },
    delivery: { status: project.stage === 'done' ? 'done' : 'waiting' },
  };
};

export const buildStageItems = (
  project: api.project.Item,
  t: TFunction,
): StageItem[] => {
  const states = resolveStageStates(project);

  return getStageDefinitions(t).map((definition) => {
    const { key, title, description } = definition;
    const state = states[key];

    return {
      key,
      title,
      description,
      status: state.status,
      percent: state.percent,
    };
  });
};

export const computeOverallPercent = (project: api.project.Item): number => {
  const states = resolveStageStates(project);
  const totalWeight = Object.values(stageWeights).reduce(
    (acc, weight) => acc + weight,
    0,
  );

  const weighted = stageOrder.reduce((acc, key) => {
    const state: StageState = states[key];
    const weight = stageWeights[key];
    const value =
      state.status === 'done'
        ? 1
        : state.status === 'waiting'
          ? 0
          : typeof state.percent === 'number'
            ? state.percent / 100
            : 0;

    return acc + value * weight;
  }, 0);

  return clampPercent((weighted / totalWeight) * 100);
};
