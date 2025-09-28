import { Button, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/router/routes.js';

export const NotFoundPage: FC = () => {
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
      <Typography textAlign='center'>{t('pages.notFound.title')}</Typography>
      <Button variant='contained' size='large' component={routes.home.Link}>
        <Typography>{t('pages.notFound.goHome')}</Typography>
      </Button>
    </Stack>
  );
};
