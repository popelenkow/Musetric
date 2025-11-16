import { Box, Stack, Typography, alpha, useMediaQuery } from '@mui/material';
import { keyframes, useTheme } from '@mui/material/styles';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StageBubbleFinishBurst } from './StageBubbleFinishBurst.js';
import { StageBubbleIcon } from './StageBubbleIcon.js';
import { StageBubbleRipple } from './StageBubbleRipple.js';
import {
  StageItem,
  clampPercent,
  getStatusColor,
} from './stageTypes.js';

const floatPulse = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export type StageBubbleProps = {
  stage: StageItem;
  celebrate?: boolean;
};

export const StageBubble: FC<StageBubbleProps> = (props) => {
  const { stage, celebrate = false } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const accent = getStatusColor(stage.status, theme);
  const isActive = stage.status === 'active';
  const isDone = stage.status === 'done';
  const hasPercent = typeof stage.percent === 'number';
  const percentValue = hasPercent ? clampPercent(stage.percent ?? 0) : undefined;
  const bubbleSize = compact ? 116 : 128;
  const shouldCelebrate = celebrate && stage.key === 'delivery';
  const shouldFloat = isActive || shouldCelebrate;
  const ringThickness = compact ? 12 : 14;
  const ringFill = hasPercent
    ? percentValue ?? 0
    : stage.status === 'done'
      ? 100
      : 0;
  const statusLabel =
    stage.status === 'active'
      ? t('pages.project.progress.status.live')
      : stage.status === 'done'
        ? t('pages.project.progress.status.done')
        : t('pages.project.progress.status.waiting');

  return (
    <Stack
      spacing={1}
      alignItems='center'
      width='100%'
    >
      <Box
        sx={{
          position: 'relative',
          width: bubbleSize,
          height: bubbleSize,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: `radial-gradient(circle at 35% 30%, ${alpha(
            accent,
            0.2,
          )}, ${alpha(accent, 0.06)})`,
          boxShadow: `0 18px 38px ${alpha(accent, 0.22)}`,
          border: `1px solid ${alpha(accent, 0.28)}`,
          animation: shouldFloat ? `${floatPulse} 2.6s ease-in-out infinite` : undefined,
          overflow: 'visible',
        }}
      >
        {hasPercent ? (
          <>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                padding: ringThickness / 2,
                boxSizing: 'border-box',
                background: `conic-gradient(${accent} ${ringFill}%, ${alpha(
                  theme.palette.text.primary,
                  0.14,
                )} ${ringFill}% 100%)`,
                mask: 'radial-gradient(farthest-side, transparent calc(50% - 50%), black 50%)',
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(50% - 50%), black 50%)',
                filter: `drop-shadow(0 0 18px ${alpha(accent, 0.35)})`,
                opacity: isDone ? 0.95 : 0.85,
                animation: `${orbit} 9s linear infinite`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: ringThickness / 2,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${alpha(
                  accent,
                  0.22,
                )}, transparent 60%)`,
                filter: 'blur(12px)',
                opacity: 0.8,
              }}
            />
          </>
        ) : undefined}
        <Box
          sx={{
            position: 'relative',
            width: bubbleSize - ringThickness * 1.6,
            height: bubbleSize - ringThickness * 1.6,
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: theme.spacing(compact ? 0.5 : 1),
            zIndex: 1,
          }}
        >
          <Stack spacing={0.3} alignItems='center'>
            {hasPercent ? (
              <>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontSize={compact ? '0.7rem' : undefined}
                >
                  {statusLabel}
                </Typography>
                <Typography
                  variant={compact ? 'h5' : 'h4'}
                  fontWeight={800}
                  lineHeight={1}
                >
                  {percentValue}%
                </Typography>
              </>
            ) : (
              <>
                <StageBubbleIcon status={stage.status} color={accent} />
                <Typography variant='body1' fontWeight={700}>
                  {statusLabel}
                </Typography>
              </>
            )}
          </Stack>
        </Box>
        {isActive ? <StageBubbleRipple color={accent} /> : undefined}
        <StageBubbleFinishBurst color={accent} visible={shouldCelebrate} />
      </Box>
      <Typography
        variant={compact ? 'subtitle2' : 'subtitle1'}
        fontWeight={700}
        textAlign='center'
        sx={{ lineHeight: 1.3 }}
      >
        {stage.title}
      </Typography>
      <Typography
        variant='body2'
        color='text.secondary'
        textAlign='center'
        sx={{ lineHeight: 1.5 }}
      >
        {stage.description}
      </Typography>
    </Stack>
  );
};
