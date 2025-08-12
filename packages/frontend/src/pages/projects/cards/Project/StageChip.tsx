import { Chip, type ChipProps } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type StageChipProps = {
  stage: api.project.Item['stage'];
  separationProgress?: number;
};

export const StageChip: FC<StageChipProps> = (props) => {
  const { stage, separationProgress } = props;
  const { t } = useTranslation();

  const stageConfig: Record<api.project.Item['stage'], { color: ChipProps['color']; label: string }> = {
    pending: {
      color: 'warning',
      label: t('pages.projects.stages.pending'),
    },
    progress: {
      color: 'info',
      label:
        separationProgress !== undefined
          ? `${(separationProgress * 100).toFixed(2)}%`
          : t('pages.projects.stages.progress'),
    },
    done: { color: 'success', label: t('pages.projects.stages.done') },
  };

  const config = stageConfig[stage];

  return <Chip size='small' color={config.color} label={config.label} sx={{ fontSize: '0.7rem' }} />;
};
