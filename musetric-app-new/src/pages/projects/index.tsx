import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routeLinks } from '../../app/AppRouter/routes';
import { useAppStore } from '../../app/store';
import { SFC } from '../../common/react';

export const ProjectsPage: SFC = () => {
    const locale = useAppStore((state) => state.locale);

    const navigate = useNavigate();

    const logout = () => {
        console.log(locale);
        navigate(routeLinks.home);
    };

    const { t } = useTranslation();

    return (
        <Stack
            direction='column'
            gap={2}
            width='100%'
            height='100dvh'
            justifyContent='center'
            alignItems='center'
        >
            <Typography>ProjectsPage</Typography>
            <Button
                onClick={logout}
                variant='contained'
            >
                {t('pages.projects.logout', 'Logout')}
            </Button>
        </Stack>
    );
};
