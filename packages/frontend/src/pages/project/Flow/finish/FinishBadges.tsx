import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FC } from 'react';

export type FinishBadgesProps = {
  labels: string[];
  colors: string[];
};

export const FinishBadges: FC<FinishBadgesProps> = (props) => {
  const { labels, colors } = props;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
        },
        gap: 1.2,
        width: '100%',
      }}
    >
      {colors.map((color, index) => (
        <Box
          key={`${color}-${index}`}
          sx={{
            borderRadius: 2,
            padding: 1.2,
            border: `1px solid ${alpha(color, 0.36)}`,
            background: `linear-gradient(135deg, ${alpha(
              color,
              0.18,
            )}, ${alpha(color, 0.08)})`,
            boxShadow: `0 12px 32px ${alpha(color, 0.18)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 18px ${alpha(color, 0.8)}`,
            }}
          />
          <Typography variant='body2' fontWeight={700}>
            {labels[index] ?? labels[labels.length - 1]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
