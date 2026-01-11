import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Chip, ChipProps } from '@mui/material';
import { api } from '@musetric/api';
import { TFunction } from 'i18next';
import { FC, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { StageKey, StageStatus, stageProgressByKey } from '../common.js';

const statusTranslations: Record<StageStatus, (t: TFunction) => string> = {
  pending: (t) => t('pages.project.progress.status.pending'),
  processing: (t) => t('pages.project.progress.status.processing'),
  done: (t) => t('pages.project.progress.status.done'),
};

const statusChipColor: Record<StageStatus, ChipProps['color']> = {
  pending: 'default',
  processing: 'primary',
  done: 'success',
};

const statusIcon: Record<StageStatus, JSX.Element> = {
  pending: <ScheduleIcon fontSize='small' />,
  processing: <AutorenewIcon fontSize='small' />,
  done: <CheckCircleIcon fontSize='small' />,
};

export type StageStatusStepStatusProps = {
  project: api.project.Item;
  stageKey: StageKey;
};
export const StageStatusStepStatus: FC<StageStatusStepStatusProps> = (
  props,
) => {
  const { project, stageKey } = props;
  const { t } = useTranslation();
  const { percent, status } = stageProgressByKey[stageKey](project);
  const statusLabel = statusTranslations[status](t);

  return (
    <Chip
      size='small'
      variant='outlined'
      color={statusChipColor[status]}
      icon={statusIcon[status]}
      label={
        typeof percent === 'number'
          ? `${statusLabel} • ${percent.toFixed(1)}%`
          : statusLabel
      }
    />
  );
};
