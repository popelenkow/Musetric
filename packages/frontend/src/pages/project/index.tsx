import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import {
  getProjectApi,
  subscribeToProjectStatus,
} from '../../api/endpoints/project.js';
import { routes } from '../../app/router/routes.js';
import { ProjectFlow } from './Flow/ProjectFlow.js';
import { ProjectPageQueryState } from './ProjectPageQueryState.js';
import { ProjectView } from './View/ProjectView.js';

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(getProjectApi(projectId));

  useEffect(() => subscribeToProjectStatus(queryClient), [queryClient]);

  if (
    project.isError ||
    project.isPending ||
    project.isLoading ||
    !project.data
  ) {
    return <ProjectPageQueryState projectQuery={project} />;
  }

  const projectData = project.data;
  return (
    <ProjectFlow project={projectData}>
      <ProjectView project={projectData} />
    </ProjectFlow>
  );
};
