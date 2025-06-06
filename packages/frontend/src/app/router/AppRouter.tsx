import { useSyncHistoryLocation, FirstMatch } from '@musetric/spa-router';
import { FC } from 'react';
import { NotFoundPage } from '../../pages/notFound';
import { ProjectPage } from '../../pages/project';
import { ProjectsPage } from '../../pages/projects';
import { routes } from './routes';

export const AppRouter: FC = () => {
  useSyncHistoryLocation();
  return (
    <FirstMatch>
      <routes.home.Match component={ProjectsPage} />
      <routes.projects.Match component={ProjectsPage} />
      <routes.project.Match component={ProjectPage} />
      <routes.any.Match component={NotFoundPage} />
    </FirstMatch>
  );
};
