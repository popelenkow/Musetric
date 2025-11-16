import { Box } from '@mui/material';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import { FC } from 'react';

const barDance = keyframes`
  0% { transform: scaleY(0.5); }
  45% { transform: scaleY(1); }
  100% { transform: scaleY(0.55); }
`;

const barDelays = [0, 140, 280, 420, 560];

export type EqualizerBarsProps = {
  accent: string;
};

export const EqualizerBars: FC<EqualizerBarsProps> = (props) => {
  const { accent } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '10px',
        gap: 6,
        height: 32,
        width: '72%',
        alignItems: 'end',
      }}
    >
      {barDelays.map((delay) => (
        <Box
          key={delay}
          sx={{
            width: 10,
            height: 32,
            borderRadius: 999,
            background: `linear-gradient(180deg, ${alpha(
              theme.palette.common.white,
              0.95,
            )}, ${alpha(accent, 0.9)})`,
            transformOrigin: 'bottom',
            animation: `${barDance} 1.6s ease-in-out ${delay}ms infinite`,
            boxShadow: `0 6px 18px ${alpha(accent, 0.25)}`,
            opacity: 0.88,
          }}
        />
      ))}
    </Box>
  );
};
