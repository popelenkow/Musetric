import { Box, Stack } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { ProjectLayout } from '../components/ProjectPageLayout.js';

export type ProjectFlowProps = {
  project: api.project.Item;
};

export const ProjectFlow: FC<ProjectFlowProps> = () => {
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
        <Stack width='100%' position='relative' gap={3}></Stack>
      </Box>
    </ProjectLayout>
  );
};
