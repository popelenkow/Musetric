import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSoundApi } from '../../../api/endpoints/sound.js';
import { routes } from '../../../app/router/routes.js';
import { QueryPending } from '../../../components/QueryView/QueryPending.js';
import favicon from '../../../favicon.ico';
import { StageChip } from '../../projects/cards/Project/StageChip.js';
import { ThemeViewColors } from '../components/ThemeViewColors.js';
import { ProjectSettings } from '../Settings/ProjectSettings.js';
import { usePlayerStore } from '../store/player.js';
import { Player } from './Player.js';
import { Spectrogram } from './Spectrogram.js';
import { Waveform } from './Waveform.js';

export type ProjectViewProps = {
  project: api.project.Item;
};
export const ProjectView: FC<ProjectViewProps> = (props) => {
  const { project } = props;

  const { t } = useTranslation();
  const sound = useQuery(getSoundApi(project.id, 'vocal'));

  const mount = usePlayerStore((s) => s.mount);
  const load = usePlayerStore((s) => s.load);
  const initialized = usePlayerStore((s) => s.initialized);

  useEffect(() => mount(), [mount]);

  useEffect(() => {
    if (!initialized || !sound.data) return;
    void load(sound.data);
  }, [sound, load, initialized]);

  if (!initialized || !sound.data) {
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
        <StageChip projectInfo={project} />
        <Box flexGrow={1} />
        <ProjectSettings />
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
