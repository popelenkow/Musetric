import { Box, Paper, alpha, useTheme } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StageStatusTile } from './StageStatusTile.js';

export type StageStatusGridProps = {
  project: api.project.Item;
};

export const StageStatusGrid: FC<StageStatusGridProps> = (props) => {
  const { project } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        padding: 4,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
        boxShadow: theme.shadows[6],
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        <StageStatusTile
          project={project}
          stageKey='queue'
          title={t('pages.project.progress.steps.queue.label')}
          description={t('pages.project.progress.steps.queue.description')}
        />
        <StageStatusTile
          project={project}
          stageKey='warmup'
          title={t('pages.project.progress.steps.warmup.label')}
          description={t('pages.project.progress.steps.warmup.description')}
        />
        <StageStatusTile
          project={project}
          stageKey='processing'
          title={t('pages.project.progress.steps.processing.label')}
          description={t('pages.project.progress.steps.processing.description')}
        />
        <StageStatusTile
          project={project}
          stageKey='delivery'
          title={t('pages.project.progress.steps.delivery.label')}
          description={t('pages.project.progress.steps.delivery.description')}
        />
      </Box>
    </Paper>
  );
};
