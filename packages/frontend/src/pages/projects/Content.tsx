import { Box } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { FC, useEffect, useMemo } from 'react';
import {
  getProjectsApi,
  type ProjectListData,
  type ProjectListItem,
} from '../../api/endpoints/project.js';
import { QueryError } from '../../common/QueryView/QueryError.js';
import { PlaceholderCard } from './cards/Placeholder.js';
import { ProjectCard } from './cards/Project/index.js';

type ProjectStatusEvent =
  | {
      projectId: ProjectListItem['id'];
      stage: 'progress';
      progress: number;
    }
  | {
      projectId: ProjectListItem['id'];
      stage: 'pending';
    }
  | {
      projectId: ProjectListItem['id'];
      stage: 'done';
    };

export const ProjectsContent: FC = () => {
  const projectsQuery = useMemo(() => getProjectsApi(), []);
  const queryClient = useQueryClient();
  const projectList = useQuery({
    ...projectsQuery,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const source = new EventSource('/api/project/status/stream');

    source.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data) as ProjectStatusEvent;
        queryClient.setQueryData<ProjectListData | undefined>(
          projectsQuery.queryKey,
          (projects) => {
            if (!projects) {
              return projects;
            }
            return projects.map((project) =>
              project.id === update.projectId
                ? {
                    ...project,
                    stage: update.stage,
                    separationProgress:
                      update.stage === 'progress'
                        ? update.progress
                        : undefined,
                  }
                : project,
            );
          },
        );
      } catch (error) {
        console.error('Failed to process project status event', error);
      }
    };

    source.onerror = (error) => {
      console.error('Project status SSE error', error);
    };

    return () => {
      source.close();
    };
  }, [projectsQuery, queryClient]);

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
