import { CircularProgress, Stack, Typography } from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectLayout } from './ProjectPageLayout.js';

export const ProjectPageLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <ProjectLayout>
      <Stack
        alignItems='center'
        justifyContent='center'
        gap={2}
        height='100%'
        width='100%'
        flex={1}
      >
        <CircularProgress size={56} thickness={5} />
        <Typography variant='h6'>
          {t('pages.project.progress.loading')}
        </Typography>
      </Stack>
    </ProjectLayout>
  );
};
