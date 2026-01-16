import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { type UseQueryResult } from '@tanstack/react-query';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectLayout } from './ProjectPageLayout.js';

export type ProjectPageErrorProps = {
  projectQuery: UseQueryResult<api.project.Item>;
};

export const ProjectPageError: FC<ProjectPageErrorProps> = (props) => {
  const { projectQuery } = props;
  const { t } = useTranslation();
  const errorMessage = api.error.getMessage(projectQuery.error);

  return (
    <ProjectLayout>
      <Stack alignItems='center' justifyContent='center' flex={1}>
        <ErrorOutlineIcon color='error' fontSize='large' />
        <Typography color='text.secondary'>
          {t('common.queryView.error')}
        </Typography>
        {errorMessage && (
          <Typography color='text.secondary' sx={{ wordBreak: 'break-word' }}>
            {errorMessage}
          </Typography>
        )}
      </Stack>
    </ProjectLayout>
  );
};
