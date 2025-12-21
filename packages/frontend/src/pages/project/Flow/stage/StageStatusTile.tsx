import { Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { StageKey } from '../common.js';
import { StageStatusBubble } from './StageStatusBubble.js';

export type StageStatusTileProps = {
  project: api.project.Item;
  stageKey: StageKey;
  title: string;
  description: string;
};

export const StageStatusTile: FC<StageStatusTileProps> = (props) => {
  const { description, project, stageKey, title } = props;
  return (
    <Stack gap={1} alignItems='center' width='100%'>
      <StageStatusBubble project={project} stageKey={stageKey} />
      <Typography
        variant='subtitle1'
        fontWeight={700}
        textAlign='center'
        sx={{ lineHeight: 1.4 }}
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        color='text.secondary'
        textAlign='center'
        sx={{ lineHeight: 1.5 }}
      >
        {description}
      </Typography>
    </Stack>
  );
};
