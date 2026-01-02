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
          stageKey='separation'
          title={t('pages.project.progress.steps.separation.label')}
          description={t('pages.project.progress.steps.separation.description')}
        />
        <StageStatusTile
          project={project}
          stageKey='transcription'
          title={t('pages.project.progress.steps.transcription.label')}
          description={t(
            'pages.project.progress.steps.transcription.description',
          )}
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
