import { Stack } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { OverallProgressBadge } from './OverallProgressBadge.js';
import { ProjectProgressIntro } from './ProjectProgressIntro.js';

export type ProjectProgressHeaderProps = {
  project: api.project.Item;
};

export const ProjectProgressHeader: FC<ProjectProgressHeaderProps> = (
  props,
) => {
  const { project } = props;

  return (
    <Stack gap={2} width='100%'>
      <OverallProgressBadge project={project} />
      <ProjectProgressIntro project={project} />
    </Stack>
  );
};
