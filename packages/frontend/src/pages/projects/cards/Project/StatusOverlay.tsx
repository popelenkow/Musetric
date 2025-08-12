import { Box } from '@mui/material';
import { api } from '@musetric/api';
import { FC, ReactNode } from 'react';
import { StageChip } from './StageChip.js';

export type StatusOverlayProps = {
  stage: api.project.Item['stage'];
  separationProgress?: number;
  children: ReactNode;
};

export const StatusOverlay: FC<StatusOverlayProps> = (props) => {
  const { stage, separationProgress, children } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {stage !== 'done' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            zIndex: 1,
          }}
        >
          <StageChip stage={stage} separationProgress={separationProgress} />
        </Box>
      )}
    </Box>
  );
};
