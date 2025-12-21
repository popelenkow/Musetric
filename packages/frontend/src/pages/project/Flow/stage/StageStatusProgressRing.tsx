import { alpha, Box, CircularProgress } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { keyframes, useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { getStatusColor, StageKey, stageProgressByKey } from '../common.js';

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export type StageStatusProgressRingProps = {
  project: api.project.Item;
  stageKey: StageKey;
};

export const stageStatusRingThickness = 14;

export const StageStatusProgressRing: FC<StageStatusProgressRingProps> = (
  props,
) => {
  const { project, stageKey } = props;
  const { percent, status } = stageProgressByKey[stageKey](project);
  const theme = useTheme();
  const accent = getStatusColor(status, theme);

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: `solid 1px ${alpha(theme.palette.common.white, 0.25)}`,
        borderRadius: '50%',
        boxShadow: `0 18px 38px ${alpha(accent, 0.2)}`,
      }}
    >
      <CircularProgress
        enableTrackSlot
        variant='determinate'
        value={percent}
        size='100%'
        sx={{
          color: accent,
          [`& .${circularProgressClasses.track}`]: {
            color: alpha(accent, 0.5),
          },
          animation: `${orbit} 9s linear infinite`,
        }}
      />
    </Box>
  );
};
