import { Box } from '@mui/material';
import { api } from '@musetric/api';
import { FC, ReactNode } from 'react';
import { StageChip } from './StageChip.js';

export type StatusOverlayProps = {
  projectInfo: api.project.Item;
  children: ReactNode;
};

export const StatusOverlay: FC<StatusOverlayProps> = (props) => {
  const { projectInfo, children } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          zIndex: 1,
        }}
      >
        <StageChip projectInfo={projectInfo} />
      </Box>
    </Box>
  );
};
