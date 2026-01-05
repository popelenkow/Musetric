import { alpha, lighten, Theme } from '@mui/material/styles';
import { api } from '@musetric/api';

export type StageKey = 'separation' | 'transcription';
export type StageStatus = 'pending' | 'processing' | 'done';

export const getStatusColor = (status: StageStatus, theme: Theme) => {
  if (status === 'done') return lighten(theme.palette.success.main, 0.15);
  if (status === 'processing') return theme.palette.primary.main;
  return alpha(theme.palette.text.secondary, 0.6);
};

export type StageProgress = { status: StageStatus; percent?: number };
export type StageProgressResolver = (
  project: api.project.Item,
) => StageProgress;

export const stageProgressByKey: Record<StageKey, StageProgressResolver> = {
  separation: (project) => {
    const getStatus = (): StageStatus => {
      if (project.stage === 'separation') {
        return 'processing';
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
        return 'processing';
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
};
