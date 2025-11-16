import { Box } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import { FC } from 'react';

const ripple = keyframes`
  0% { transform: scale(0.92); opacity: 0.5; }
  60% { transform: scale(1.18); opacity: 0; }
  100% { transform: scale(1.18); opacity: 0; }
`;

export type StageBubbleRippleProps = {
  color: string;
};

export const StageBubbleRipple: FC<StageBubbleRippleProps> = (props) => {
  const { color } = props;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: -14,
        borderRadius: '50%',
        border: `1px solid ${alpha(color, 0.4)}`,
        animation: `${ripple} 2.8s ease-out infinite`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
