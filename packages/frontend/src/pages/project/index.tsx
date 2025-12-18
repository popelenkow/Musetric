import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import {
  getProjectApi,
  subscribeToProjectStatus,
} from '../../api/endpoints/project.js';
import { routes } from '../../app/router/routes.js';
import { ProjectPageError } from './components/ProjectPageError.js';
import { ProjectPageLoading } from './components/ProjectPageLoading.js';
import { ProjectFlow } from './Flow/ProjectFlow.js';
import { ProjectView } from './View/ProjectView.js';

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(getProjectApi(projectId));

  useEffect(() => subscribeToProjectStatus(queryClient), [queryClient]);

  if (project.status === 'error') {
    return <ProjectPageError projectQuery={project} />;
  }

  if (project.isPending) {
    return <ProjectPageLoading />;
  }

  if (project.data.stage !== 'done') {
    return <ProjectFlow project={project.data} />;
  }

  return <ProjectView project={project.data} />;
};
