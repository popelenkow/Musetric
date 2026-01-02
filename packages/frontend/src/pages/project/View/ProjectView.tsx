import { Box, Stack } from '@mui/material';
import { api } from '@musetric/api';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { endpoints } from '../../../api/index.js';
import { QueryPending } from '../../../components/QueryView/QueryPending.js';
import { ProjectBackButton } from '../components/ProjectBackButton.js';
import { ProjectLayout } from '../components/ProjectPageLayout.js';
import { ThemeViewColors } from '../components/ThemeViewColors.js';
import { ProjectSettings } from '../Settings/ProjectSettings.js';
import { usePlayerStore } from '../store/player.js';
import { Player } from './Player.js';
import { Spectrogram } from './Spectrogram.js';
import { Subtitle } from './Subtitle.js';
import { Waveform } from './Waveform.js';

export type ProjectViewProps = {
  project: api.project.Item;
};
export const ProjectView: FC<ProjectViewProps> = (props) => {
  const { project } = props;

  const sound = useQuery(endpoints.getSound(project.id, 'vocal'));
  const subtitle = useQuery(endpoints.getSubtitle(project.id));

  const mount = usePlayerStore((s) => s.mount);
  const load = usePlayerStore((s) => s.load);
  const initialized = usePlayerStore((s) => s.initialized);

  useEffect(() => mount(), [mount]);

  useEffect(() => {
    if (!initialized || !sound.data) return;
    void load(sound.data);
  }, [sound.data, load, initialized]);

  if (!initialized || !sound.data || !subtitle.data) {
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
        padding={4}
        gap={4}
        width='100%'
        flexGrow={1}
        sx={{
          scrollbarGutter: 'stable',
        }}
      >
        <Box width='100%' flexGrow={1} flexBasis={0} minHeight={0}>
          <Spectrogram />
        </Box>
        <Box height='80px' width='100%'>
          <Waveform />
        </Box>
        <Subtitle subtitle={subtitle.data} />
        <Player />
      </Stack>
      <ThemeViewColors />
    </ProjectLayout>
  );
};
