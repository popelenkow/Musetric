import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/router/routes';
import favicon from '../../favicon.ico';

export const ProjectPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction='column'
      padding={4}
      gap={4}
      width='100%'
      height='100dvh'
      overflow='auto'
      sx={{
        scrollbarGutter: 'stable',
      }}
    >
      <Stack direction='row' gap={2} alignItems='center'>
        <IconButton component={routes.projects.Link}>
          <ArrowBackIcon />
        </IconButton>
        <CardMedia
          component='img'
          image={favicon}
          sx={{
            width: '36px',
            height: '36px',
          }}
        />
        <Typography variant='h4'>{t('pages.project.title')}</Typography>
      </Stack>
    </Stack>
  );
};
