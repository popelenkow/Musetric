import { Box, Stack } from '@mui/material';
import { type api } from '@musetric/api';
import { useQuery } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { endpoints } from '../../../api/index.js';
import { ProjectBackButton } from '../components/ProjectBackButton.js';
import { ProjectLayout } from '../components/ProjectPageLayout.js';
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

  const audio = useQuery(endpoints.audioDelivery.get(project.id, 'lead'));

  const mount = usePlayerStore((s) => s.mount);

  useEffect(() => {
    if (!audio.data) return;
    return mount(audio.data);
  }, [audio.data, mount]);

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
        width='100%'
        flexGrow={1}
        sx={{
          scrollbarGutter: 'stable',
        }}
      >
        <Box width='100%' flexGrow={1} flexBasis={0} minHeight={0}>
          <Spectrogram status={audio.status} />
        </Box>
        <Box height='80px' width='100%'>
          <Waveform projectId={project.id} type='lead' />
        </Box>
        <Subtitle projectId={project.id} />
        <Player />
      </Stack>
    </ProjectLayout>
  );
};
