import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { StageKey, stageProgressByKey } from '../common.js';
import { StageStatusBubbleContent } from './StageStatusBubbleContent.js';
import { StageStatusProgressRing } from './StageStatusProgressRing.js';
import { StageStatusPulse } from './StageStatusPulse.js';

const floatPulse = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

export type StageStatusBubbleProps = {
  project: api.project.Item;
  stageKey: StageKey;
};

export const StageStatusBubble: FC<StageStatusBubbleProps> = (props) => {
  const { project, stageKey } = props;
  const { status } = stageProgressByKey[stageKey](project);

  return (
    <Box
      margin={2}
      sx={{
        position: 'relative',
        width: 128,
        height: 128,
        animation:
          status === 'active'
            ? `${floatPulse} 4s ease-in-out infinite`
            : undefined,
      }}
    >
      <StageStatusProgressRing project={project} stageKey={stageKey} />
      <StageStatusPulse project={project} stageKey={stageKey} />
      <StageStatusBubbleContent project={project} stageKey={stageKey} />
    </Box>
  );
};
