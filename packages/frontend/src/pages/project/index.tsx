import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getProjectApi,
  subscribeToProjectStatus,
} from '../../api/endpoints/project.js';
import { getSoundApi } from '../../api/endpoints/sound.js';
import { routes } from '../../app/router/routes.js';
import { QueryPending } from '../../common/QueryView/QueryPending.js';
import favicon from '../../favicon.ico';
import { StageChip } from '../projects/cards/Project/StageChip.js';
import { Player } from './Player.js';
import { Settings } from './Settings/index.js';
import { Spectrogram } from './Spectrogram.js';
import { usePlayerStore } from './store/player.js';
import { ThemeViewColors } from './ThemeViewColors.js';
import { Waveform } from './Waveform.js';

export const ProjectPage: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(getProjectApi(projectId));
  const soundType = project.data?.stage === 'done' ? 'vocal' : 'original';
  const sound = useQuery(getSoundApi(projectId, soundType));

  const init = usePlayerStore((s) => s.mount);
  const load = usePlayerStore((s) => s.load);
  const initialized = usePlayerStore((s) => s.initialized);

  useEffect(() => subscribeToProjectStatus(queryClient), [queryClient]);

  useEffect(() => {
    const unmount = init();
    return unmount;
  }, [init]);

  useEffect(() => {
    if (!initialized || !sound.data) return;
    void load(sound.data);
  }, [sound, load, initialized]);

  if (!initialized || !project.data || !sound.data) {
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
        <StageChip projectInfo={project.data} />
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
