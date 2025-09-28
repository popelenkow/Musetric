import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { FC } from 'react';
import { getProjectsApi } from '../../api/endpoints/project.js';
import { QueryError } from '../../common/QueryView/QueryError.js';
import { PlaceholderCard } from './cards/Placeholder.js';
import { ProjectCard } from './cards/Project/index.js';

export const ProjectsContent: FC = () => {
  const projectList = useQuery(getProjectsApi());

  if (projectList.isError) {
    return <QueryError error={projectList.error} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gap: 4,
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
        },
      }}
    >
      {projectList.isPending ? (
        Array.from({ length: 6 }).map((_, i) => <PlaceholderCard key={i} />)
      ) : (
        <AnimatePresence initial={false}>
          {projectList.data.map((projectInfo) => (
            <ProjectCard key={projectInfo.id} projectInfo={projectInfo} />
          ))}
        </AnimatePresence>
      )}
    </Box>
  );
};
