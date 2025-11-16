import { Box } from '@mui/material';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import { FC } from 'react';

export type ConfettiPiece = { left: string; delay: number };

const confettiFall = keyframes`
  0% { transform: translate3d(0, -28px, 0) rotate(0deg); opacity: 0; }
  18% { opacity: 1; }
  100% { transform: translate3d(0, 160px, 0) rotate(260deg); opacity: 0; }
`;

export type ConfettiLayerProps = {
  pieces: ConfettiPiece[];
};

export const ConfettiLayer: FC<ConfettiLayerProps> = (props) => {
  const { pieces } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {pieces.map((piece, index) => {
        const palette = [
          theme.palette.success.main,
          theme.palette.primary.main,
          theme.palette.warning.main,
        ];
        const startColor = palette[index % palette.length];
        const endColor = palette[(index + 1) % palette.length];

        return (
          <Box
            key={`${piece.left}-${piece.delay}`}
            sx={{
              position: 'absolute',
              top: -22,
              left: piece.left,
              width: { xs: 10, sm: 12 },
              height: 5,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${startColor}, ${alpha(
                endColor,
                0.75,
              )})`,
              boxShadow: `0 12px 28px ${alpha(startColor, 0.22)}`,
              animation: `${confettiFall} 2.6s ease-out ${piece.delay}ms forwards`,
              opacity: 0.95,
            }}
          />
        );
      })}
    </Box>
  );
};
