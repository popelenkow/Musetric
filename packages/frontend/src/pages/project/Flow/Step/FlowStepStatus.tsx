import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Chip, ChipProps } from '@mui/material';
import { api } from '@musetric/api';
import { TFunction } from 'i18next';
import { FC, JSX } from 'react';
import { useTranslation } from 'react-i18next';

const getStatusTranslations = (
  t: TFunction,
): Record<api.project.ProcessingStepStatus, string> => ({
  pending: t('pages.project.progress.status.pending'),
  processing: t('pages.project.progress.status.processing'),
  done: t('pages.project.progress.status.done'),
});

const statusChipColor: Record<
  api.project.ProcessingStepStatus,
  ChipProps['color']
> = {
  pending: 'default',
  processing: 'primary',
  done: 'success',
};

const statusIcon: Record<api.project.ProcessingStepStatus, JSX.Element> = {
  pending: <ScheduleIcon fontSize='small' />,
  processing: <AutorenewIcon fontSize='small' />,
  done: <CheckCircleIcon fontSize='small' />,
};

export type FlowStepStatusProps = {
  step: api.project.ProcessingStep;
};
export const FlowStepStatus: FC<FlowStepStatusProps> = (props) => {
  const { step } = props;
  const { t } = useTranslation();

  const statusLabel = getStatusTranslations(t)[step.status];

  return (
    <Chip
      size='small'
      variant='outlined'
      color={statusChipColor[step.status]}
      icon={statusIcon[step.status]}
      label={
        step.progress !== undefined
          ? `${statusLabel} • ${(step.progress * 100).toFixed(1)}%`
          : statusLabel
      }
    />
  );
};
