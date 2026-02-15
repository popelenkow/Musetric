import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { endpoints } from '../../api/index.js';
import { routes } from '../../app/router/routes.js';
import { ProjectPageError } from './components/ProjectPageError.js';
import { ProjectPageLoading } from './components/ProjectPageLoading.js';
import { ProjectProgressFlow } from './Flow/ProjectProgressFlow.js';
import { ProjectView } from './View/ProjectView.js';

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(endpoints.project.get(projectId));

  useEffect(
    () => endpoints.project.subscribeToStatus(queryClient),
    [queryClient],
  );

  if (project.status === 'error') {
    return <ProjectPageError projectQuery={project} />;
  }

  if (project.isPending) {
    return <ProjectPageLoading />;
  }

  if (!project.data.processing.done) {
    return <ProjectProgressFlow project={project.data} />;
  }

  return <ProjectView project={project.data} />;
};
