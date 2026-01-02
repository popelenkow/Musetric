import { alpha, lighten, Theme } from '@mui/material/styles';
import { api } from '@musetric/api';

export type StageKey = 'queue' | 'separation' | 'transcription' | 'delivery';
export type StageStatus = 'pending' | 'active' | 'done';
export type StageItem = {
  key: StageKey;
  title: string;
  description: string;
  status: StageStatus;
  percent?: number;
};

export const getStatusColor = (status: StageStatus, theme: Theme) => {
  if (status === 'done') return lighten(theme.palette.success.main, 0.15);
  if (status === 'active') return theme.palette.primary.main;
  return alpha(theme.palette.text.secondary, 0.6);
};

export type StageProgress = { status: StageStatus; percent?: number };
export type StageProgressResolver = (
  project: api.project.Item,
) => StageProgress;

export const stageProgressByKey: Record<StageKey, StageProgressResolver> = {
  queue: (project) => ({
    status: project.stage === 'pending' ? 'active' : 'done',
  }),
  separation: (project) => {
    const getStatus = (): StageStatus => {
      if (project.stage === 'separation') {
        return 'active';
      }
      if (project.stage === 'transcription') {
        return 'done';
      }
      if (project.stage === 'done') {
        return 'done';
      }
      return 'pending';
    };
    const getPercent = (): number | undefined => {
      if (project.stage !== 'separation') return undefined;
      if (typeof project.progress !== 'number') return undefined;
      return project.progress * 100;
    };

    const status = getStatus();
    const percent = getPercent();

    return { status, percent };
  },
  transcription: (project) => {
    const getStatus = (): StageStatus => {
      if (project.stage === 'transcription') {
        return 'active';
      }
      if (project.stage === 'done') {
        return 'done';
      }
      return 'pending';
    };
    const getPercent = (): number | undefined => {
      if (project.stage !== 'transcription') return undefined;
      if (typeof project.progress !== 'number') return undefined;
      return project.progress * 100;
    };

    const status = getStatus();
    const percent = getPercent();

    return { status, percent };
  },
  delivery: (project) => ({
    status: project.stage === 'done' ? 'done' : 'pending',
  }),
};

export const computeOverallPercent = (project: api.project.Item): number => {
  const stages = Object.values(stageProgressByKey).map((resolver) =>
    resolver(project),
  );

  const completedFraction = stages.reduce((acc, stage) => {
    if (stage.status === 'done') return acc + 1;
    if (stage.status === 'active' && typeof stage.percent === 'number') {
      return acc + stage.percent / 100;
    }
    return acc;
  }, 0);

  return (completedFraction / stages.length) * 100;
};
