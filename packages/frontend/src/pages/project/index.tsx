import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FC, useMemo } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { getSoundApi } from '../../api/endpoints/sound';
import { routes } from '../../app/router/routes';
import { QueryError } from '../../common/QueryView/QueryError';
import { QueryNotFound } from '../../common/QueryView/QueryNotFound';
import { QueryPending } from '../../common/QueryView/QueryPending';
import favicon from '../../favicon.ico';
import { Player } from './Player';

export const ProjectPage: FC = () => {
  const { t } = useTranslation();
  const { projectId } = routes.project.useAssertMatch();
  const sound = useQuery(getSoundApi(projectId, 'original'));

  const blob = useMemo(() => {
    if (!sound.data) return undefined;
    return new Blob([sound.data]);
  }, [sound.data]);

  let content: JSX.Element | null = null;
  if (sound.isPending) content = <QueryPending />;
  else if (sound.isError) content = <QueryError error={sound.error} />;
  else if (!blob) content = <QueryNotFound error={undefined} />;
  else content = <Player blob={blob} />;

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
      <Box sx={{ width: '100%' }}>{content}</Box>
    </Stack>
  );
};
