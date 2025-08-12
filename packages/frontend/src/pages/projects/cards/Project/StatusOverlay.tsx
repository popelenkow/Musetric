import { Box, Chip } from '@mui/material';
import { api } from '@musetric/api';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const getStageChip = (
  stage: api.project.Item['stage'],
  progressPercent: number | undefined,
  t: (key: string) => string,
) => {
  const stageConfig = {
    init: { color: 'default' as const, label: t('pages.projects.stages.init') },
    pending: {
      color: 'warning' as const,
      label: t('pages.projects.stages.pending'),
    },
    progress: {
      color: 'info' as const,
      label:
        progressPercent !== undefined
          ? `${(progressPercent * 100).toFixed(1)}%`
          : t('pages.projects.stages.progress'),
    },
    done: { color: 'success' as const, label: t('pages.projects.stages.done') },
  };

  const config = stageConfig[stage];
  return (
    <Chip
      size='small'
      color={config.color}
      label={config.label}
      sx={{ fontSize: '0.7rem' }}
    />
  );
};

export type StatusOverlayProps = {
  stage: api.project.Item['stage'];
  progressPercent?: number;
  children: ReactNode;
};

export const StatusOverlay: FC<StatusOverlayProps> = (props) => {
  const { stage, progressPercent, children } = props;
  const { t } = useTranslation();

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {stage !== 'done' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            zIndex: 1,
          }}
        >
          {getStageChip(stage, progressPercent, t)}
        </Box>
      )}
    </Box>
  );
};
