import { Box, Stack } from '@mui/material';
import { api } from '@musetric/api';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { getSoundApi } from '../../../api/endpoints/sound.js';
import { QueryPending } from '../../../components/QueryView/QueryPending.js';
import { ProjectBackButton } from '../components/ProjectBackButton.js';
import { ProjectLayout } from '../components/ProjectPageLayout.js';
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
    <ProjectLayout
      heading={
        <>
          <ProjectBackButton />
          <Box flexGrow={1} />
          <ProjectSettings />
        </>
      }
    >
      <Stack
        direction='column'
        padding={4}
        gap={4}
        width='100%'
        flexGrow={1}
        overflow='auto'
        position='relative'
        sx={{
          scrollbarGutter: 'stable',
        }}
      >
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
    </ProjectLayout>
  );
};
