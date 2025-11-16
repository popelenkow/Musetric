import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../../app/router/routes.js';

export type ProjectBackButtonProps = {
  sx?: SxProps<Theme>;
};

export const ProjectBackButton: FC<ProjectBackButtonProps> = (props) => {
  const { sx } = props;
  const { t } = useTranslation();

  return (
    <Button
      component={routes.home.Link}
      startIcon={<ArrowBackIcon />}
      variant='outlined'
      color='default'
      sx={sx}
    >
      {t('pages.project.progress.backHome')}
    </Button>
  );
};
