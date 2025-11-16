import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import { FC } from 'react';
import { EqualizerBars } from './EqualizerBars.js';
import { FinishBadges } from './FinishBadges.js';

const beamWipe = keyframes`
  0% { transform: translateX(-60%) skewX(-16deg); opacity: 0; }
  30% { opacity: 0.7; }
  100% { transform: translateX(115%) skewX(-16deg); opacity: 0; }
`;

const glowPulse = keyframes`
  0% { transform: scale(0.96); opacity: 0.78; }
  50% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(0.96); opacity: 0.78; }
`;

export type CelebrationCardProps = {
  accent: string;
  badgeLabels: string[];
  statusLabel: string;
  title: string;
  subtitle: string;
  detail: string;
};

export const CelebrationCard: FC<CelebrationCardProps> = (props) => {
  const { accent, badgeLabels, statusLabel, title, subtitle, detail } = props;
  const theme = useTheme();
  const badgeColors = [
    accent,
    theme.palette.primary.main,
    theme.palette.info.main,
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 3, sm: 4, md: 5 },
        py: { xs: 3, sm: 4 },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(
          accent,
          0.2,
        )}, ${alpha(theme.palette.primary.main, 0.18)})`,
        border: `1px solid ${alpha(accent, 0.38)}`,
        boxShadow: `0 24px 55px ${alpha(accent, 0.2)}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(120deg, transparent 42%, ${alpha(
            theme.palette.common.white,
            0.14,
          )} 50%, transparent 58%)`,
          transform: 'translateX(-110%)',
          animation: `${beamWipe} 2.6s ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2.5, md: 3.5 }}
        alignItems='center'
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 120, sm: 140 },
            height: { xs: 120, sm: 140 },
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: `radial-gradient(circle at 40% 35%, ${alpha(
              accent,
              0.32,
            )}, ${alpha(accent, 0.12)})`,
            border: `1px solid ${alpha(accent, 0.45)}`,
            boxShadow: `0 15px 36px ${alpha(accent, 0.28)}`,
            animation: `${glowPulse} 2.6s ease-in-out infinite`,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: '20%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(
                theme.palette.common.white,
                0.16,
              )}, transparent 70%)`,
              filter: 'blur(6px)',
            }}
          />
          <CheckCircleRoundedIcon
            sx={{
              fontSize: 52,
              color: theme.palette.common.white,
              textShadow: `0 6px 22px ${alpha(accent, 0.4)}`,
            }}
          />
          <EqualizerBars accent={accent} />
        </Box>
        <Stack
          spacing={1.2}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
        >
          <Typography variant='overline' color='text.secondary' letterSpacing={1.2}>
            {statusLabel}
          </Typography>
          <Typography variant='h5' fontWeight={800}>
            {title}
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ maxWidth: 560 }}
          >
            {subtitle}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ maxWidth: 520 }}
          >
            {detail}
          </Typography>
          <FinishBadges labels={badgeLabels} colors={badgeColors} />
        </Stack>
      </Stack>
    </Paper>
  );
};
