import { Stack } from '@mui/material';
import { FC } from 'react';
import { routes } from '../../app/router/routes';
import { ProjectsContent } from './Content';
import { CreateDialog } from './dialogs/Create';
import { DeleteDialog } from './dialogs/Delete';
import { EditDialog } from './dialogs/Edit';
import { ProjectsTitle } from './Title';

export const ProjectsPage: FC = () => {
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
      <ProjectsTitle />
      <ProjectsContent />
      <routes.projectsCreate.Match component={CreateDialog} />
      <routes.projectsEdit.Match component={EditDialog} />
      <routes.projectsDelete.Match component={DeleteDialog} />
    </Stack>
  );
};
