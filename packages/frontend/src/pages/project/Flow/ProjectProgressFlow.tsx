import { Box, Stack } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { ProjectLayout } from '../components/ProjectPageLayout.js';
import { ProjectProgressHeader } from './header/ProjectProgressHeader.js';
import { StageStatusGrid } from './stage/StageStatusGrid.js';

export type ProjectProgressFlowProps = {
  project: api.project.Item;
};

export const ProjectProgressFlow: FC<ProjectProgressFlowProps> = (props) => {
  const { project } = props;

  return (
    <ProjectLayout isHeadingAbsolute>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        padding={4}
        flex={1}
      >
        <Stack width='100%' position='relative' gap={3}>
          <ProjectProgressHeader project={project} />
          <StageStatusGrid project={project} />
        </Stack>
      </Box>
    </ProjectLayout>
  );
};
