import { Box } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import { FC } from 'react';

const spark = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  50% { opacity: 0.9; }
  100% { transform: scale(1.4); opacity: 0; }
`;

export type StageBubbleFinishBurstProps = {
  color: string;
  visible: boolean;
};

export const StageBubbleFinishBurst: FC<StageBubbleFinishBurstProps> = (props) => {
  const { color, visible } = props;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: -10,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(color, 0.18)}, transparent 62%)`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `rotate(${index * 60}deg) translate(34px)`,
          }}
        >
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor:
                index % 2 === 0 ? color : alpha(color, 0.6),
              animation: `${spark} 1.8s ease-out infinite`,
              animationDelay: `${index * 110}ms`,
              boxShadow: `0 0 12px ${alpha(color, 0.5)}`,
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
