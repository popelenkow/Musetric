import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { UseQueryResult } from '@tanstack/react-query';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type ProjectPageQueryStateProps = {
  projectQuery: UseQueryResult<api.project.Item>;
};

export const ProjectPageQueryState: FC<ProjectPageQueryStateProps> = (
  props,
) => {
  const { projectQuery } = props;
  const { t } = useTranslation();

  if (projectQuery.isError) {
    return (
      <Stack
        minHeight='100dvh'
        alignItems='center'
        justifyContent='center'
        padding={{ xs: 3, sm: 4 }}
      >
        <Paper
          elevation={1}
          sx={{
            width: '100%',
            maxWidth: 520,
            padding: { xs: 3, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Stack spacing={2.5} alignItems='center'>
            <ErrorOutlineIcon color='error' sx={{ fontSize: 48 }} />
            <Typography variant='h6'>
              {t('pages.project.progress.trackTitle')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('common.queryView.error')}
            </Typography>
            {!!projectQuery.error && (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ wordBreak: 'break-word' }}
              >
                {String(projectQuery.error)}
              </Typography>
            )}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack
      minHeight='100dvh'
      alignItems='center'
      justifyContent='center'
      padding={{ xs: 3, sm: 4 }}
    >
      <Paper
        elevation={1}
        sx={{
          width: '100%',
          maxWidth: 520,
          padding: { xs: 3, sm: 4 },
          textAlign: 'center',
        }}
      >
        <Stack spacing={2.5} alignItems='center'>
          <CircularProgress size={56} thickness={5} />
          <Stack spacing={0.5}>
            <Typography variant='h6'>
              {t('pages.project.progress.trackTitle')}
            </Typography>
            <Typography variant='body1'>
              {t('pages.project.progress.loading')}
            </Typography>
          </Stack>
          <Typography variant='body2' color='text.secondary'>
            {t('pages.project.progress.loadingHint')}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
