import { LinearProgress, Typography, Box } from '@mui/material';
import { api } from '@musetric/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type ProgressIndicatorProps = {
  projectId: number;
};

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  projectId,
}) => {
  const { t } = useTranslation();

  const { data: progress } = useQuery({
    queryKey: ['project', projectId, 'progress'],
    queryFn: async () =>
      api.project.progress.request(axios, { params: { projectId } }),
    refetchInterval: 1000, // Poll every 1 second
  });

  if (!progress || progress.stage === 'done') return undefined;

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'init':
        return t('pages.project.progress.init');
      case 'pending':
        return t('pages.project.progress.pending');
      case 'progress':
        return t('pages.project.progress.inProgress');
      default:
        return '';
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          {progress.progressPercent !== undefined
            ? `${(progress.progressPercent * 100).toFixed(1)}%`
            : getStageText(progress.stage)}
        </Typography>
      </Box>
      <LinearProgress
        variant={
          progress.progressPercent !== undefined
            ? 'determinate'
            : 'indeterminate'
        }
        value={
          progress.progressPercent !== undefined
            ? progress.progressPercent * 100
            : undefined
        }
        sx={{ mt: 1 }}
      />
    </Box>
  );
};
