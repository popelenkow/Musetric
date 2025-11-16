import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import {
  getProjectApi,
  subscribeToProjectStatus,
} from '../../api/endpoints/project.js';
import { routes } from '../../app/router/routes.js';
import { ProjectFlow } from './Flow/ProjectFlow.js';
import { ProjectFlowFinish } from './Flow/ProjectFlowFinish.js';
import { ProjectFlowLayout } from './Flow/ProjectFlowLayout.js';
import { useProjectFinishAnimation } from './Flow/useProjectFinishAnimation.js';
import { ProjectPageError } from './ProjectPageError.js';
import { ProjectPagePending } from './ProjectPagePending.js';
import { ProjectView } from './View/ProjectView.js';

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(getProjectApi(projectId));
  const { shouldShowFinishAnimation } = useProjectFinishAnimation(project.data);

  useEffect(() => subscribeToProjectStatus(queryClient), [queryClient]);

  if (project.status === 'error') {
    return (
      <ProjectFlowLayout variant='progress'>
        <ProjectPageError projectQuery={project} />
      </ProjectFlowLayout>
    );
  }

  if (project.isPending) {
    return (
      <ProjectFlowLayout variant='progress'>
        <ProjectPagePending />
      </ProjectFlowLayout>
    );
  }

  if (shouldShowFinishAnimation) {
    return <ProjectFlowFinish project={project.data} />;
  }

  if (project.data.stage !== 'done') {
    return <ProjectFlow project={project.data} />;
  }

  return (
    <ProjectFlowLayout variant='ready'>
      <ProjectView project={project.data} />
    </ProjectFlowLayout>
  );
};
