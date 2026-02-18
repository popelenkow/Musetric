import { api } from '@musetric/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { endpoints } from '../../api/index.js';
import { routes } from '../../app/router/routes.js';
import { ErrorView } from './components/ErrorView.js';
import { LoadingView } from './components/LoadingView.js';
import { ProjectLayout } from './components/ProjectPageLayout.js';
import { ProjectProgressFlow } from './Flow/ProjectProgressFlow.js';
import { ProjectView } from './View/ProjectView.js';

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(endpoints.project.get(projectId));

  useEffect(
    () => endpoints.project.subscribeToStatus(queryClient),
    [queryClient],
  );

  if (project.status === 'error') {
    const errorMessage = api.error.getMessage(project.error);

    return (
      <ProjectLayout>
        <ErrorView
          message={errorMessage ?? t('pages.project.progress.error.project')}
        />
      </ProjectLayout>
    );
  }

  if (project.status === 'pending') {
    return (
      <ProjectLayout>
        <LoadingView message={t('pages.project.progress.loading')} />
      </ProjectLayout>
    );
  }

  if (!project.data.processing.done) {
    return <ProjectProgressFlow project={project.data} />;
  }

  return <ProjectView project={project.data} />;
};
