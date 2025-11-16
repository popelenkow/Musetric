import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ProjectPagePending: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      padding={{ xs: 3, sm: 4 }}
      width='100%'
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
