import { Theme, alpha } from '@mui/material/styles';

export type StageKey = 'queue' | 'warmup' | 'processing' | 'delivery';
export type StageStatus = 'waiting' | 'active' | 'done';
export type StageItem = {
  key: StageKey;
  title: string;
  description: string;
  status: StageStatus;
  percent?: number;
};

export const clampPercent = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

export const getStatusColor = (status: StageStatus, theme: Theme) => {
  if (status === 'done') return theme.palette.success.main;
  if (status === 'active') return theme.palette.primary.main;
  return alpha(theme.palette.text.secondary, 0.6);
};
