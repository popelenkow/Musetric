import { CardMedia, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import favicon from '../../favicon.ico';

export const ProjectsTitle: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack direction='row' gap={2} alignItems='center'>
      <CardMedia
        component='img'
        image={favicon}
        sx={{
          width: '36px',
          height: '36px',
        }}
      />
      <Typography variant='h4'>{t('pages.projects.title')}</Typography>
    </Stack>
  );
};
