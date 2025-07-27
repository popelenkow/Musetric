import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSoundApi } from '../../api/endpoints/sound';
import { routes } from '../../app/router/routes';
import { QueryPending } from '../../common/QueryView/QueryPending';
import favicon from '../../favicon.ico';
import { Player } from './Player';
import { Settings } from './Settings';
import { Spectrogram } from './Spectrogram';
import { usePlayerStore } from './store/player';
import { ThemeViewColors } from './ThemeViewColors';
import { Waveform } from './Waveform';

export const ProjectPage: FC = () => {
  const { t } = useTranslation();

  const { projectId } = routes.project.useAssertMatch();
  const { data } = useQuery(getSoundApi(projectId, 'original'));

  const init = usePlayerStore((s) => s.mount);
  const load = usePlayerStore((s) => s.load);
  const initialized = usePlayerStore((s) => s.initialized);

  useEffect(() => {
    const unmount = init();
    return unmount;
  }, [init]);

  useEffect(() => {
    if (!initialized || !data) return;
    void load(data);
  }, [data, load, initialized]);

  if (!initialized || !data) {
    return <QueryPending />;
  }

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
        <Box flexGrow={1} />
        <Settings />
      </Stack>
      <Stack gap={1} width='100%' sx={{ mt: 'auto' }} alignItems='center'>
        <Box height='512px' width='100%'>
          <Spectrogram />
        </Box>
        <Box height='80px' width='100%'>
          <Waveform />
        </Box>
        <Player />
      </Stack>
      <ThemeViewColors />
    </Stack>
  );
};
