import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { routeLinks } from '../../app/AppRouter/routes';
import { SFC } from '../../common/react';

export const NotFoundPage: SFC = () => {
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
            <Typography textAlign='center'>
                {t('pages.notFound.label', 'Page not found')}
            </Typography>
            <Button
                variant='contained'
                size='large'
                component={Link}
                to={routeLinks.home}
            >
                <Typography>
                    {t('pages.notFound.goHome', 'Back to home')}
                </Typography>
            </Button>
        </Stack>
    );
};
