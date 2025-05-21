import { CardMedia, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/router/routes';
import favicon from '../../favicon.ico';
import { ProjectsContent } from './Content';
import { CreateDialog } from './dialogs/Create';
import { DeleteDialog } from './dialogs/Delete';
import { EditDialog } from './dialogs/Edit';

export const ProjectsPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction='column'
      padding={4}
      gap={4}
      width='100%'
      height='100dvh'
      overflow='auto'
      sx={{
        scrollbarGutter: 'stable',
      }}
    >
      <Stack direction='row' gap={2} alignItems='center'>
        <CardMedia
          component='img'
          image={favicon}
          sx={{
            width: '36px',
            height: '36px',
          }}
        />
        <Typography variant='h4'>{t('pages.projects.title')}</Typography>
      </Stack>
      <ProjectsContent />
      <routes.projectsCreate.Match component={CreateDialog} />
      <routes.projectsEdit.Match component={EditDialog} />
      <routes.projectsDelete.Match component={DeleteDialog} />
    </Stack>
  );
};
