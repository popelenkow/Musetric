import { Route, Routes } from 'react-router-dom';
import { SFC } from '../../common/react';
import { NotFoundPage } from '../../pages/notFound';
import { ProjectsPage } from '../../pages/projects';
import { WorkshopPage } from '../../pages/workshop';
import { routePatterns } from './routes';

export const AppRouter: SFC = () => {
    return (
        <Routes>
            <Route
                path={routePatterns.workshop}
                element={<WorkshopPage />}
            />
            <Route
                path={routePatterns.projects}
                element={<ProjectsPage />}
            />
            <Route
                path={routePatterns.home}
                element={<ProjectsPage />}
            />
            <Route
                path='*'
                element={<NotFoundPage />}
            />
        </Routes>
    );
};
