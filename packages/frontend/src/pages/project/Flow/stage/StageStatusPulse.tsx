import { Box, alpha, keyframes, useTheme } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { StageKey, stageProgressByKey } from '../common.js';

const ripple = keyframes`
  0% { transform: scale(0.9); opacity: 0.5; }
  60% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(1.1); opacity: 0; }
`;

export type StageStatusPulseProps = {
  project: api.project.Item;
  stageKey: StageKey;
};

export const StageStatusPulse: FC<StageStatusPulseProps> = (props) => {
  const { project, stageKey } = props;
  const { status } = stageProgressByKey[stageKey](project);
  const theme = useTheme();

  if (status !== 'active') {
    return undefined;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: -14,
        borderRadius: '50%',
        border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
        animation: `${ripple} 4s ease-out infinite`,
      }}
    />
  );
};
