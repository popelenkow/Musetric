import { Stack } from '@mui/material';
import { FC } from 'react';
import { routes } from '../../app/router/routes.js';
import { ProjectsContent } from './Content.js';
import { CreateDialog } from './dialogs/Create.js';
import { DeleteDialog } from './dialogs/Delete.js';
import { EditDialog } from './dialogs/Edit.js';
import { ProjectsTitle } from './Title.js';

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
