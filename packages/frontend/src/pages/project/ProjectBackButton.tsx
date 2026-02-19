import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/router/routes.js';

export const ProjectBackButton: FC = () => {
  const { t } = useTranslation();

  return (
    <Button
      component={routes.home.Link}
      startIcon={<ArrowBackIcon />}
      variant='outlined'
      color='default'
    >
      {t('pages.project.progress.backHome')}
    </Button>
  );
};
