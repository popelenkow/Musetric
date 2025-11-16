import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Stack, Typography, alpha, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { UseQueryResult } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/router/routes.js';
import { CircularProgressWithLabel } from '../../components/CircularProgressWithLabel.js';
import { QueryError } from '../../components/QueryView/QueryError.js';
import { StageBubble } from './StageBubble.js';
import {
  StageItem,
  StageKey,
  StageStatus,
  clampPercent,
} from './stageTypes.js';

const buildStages = (project: api.project.Item, t: TFunction): StageItem[] => {
  const stage = project.stage;
  const normalizedProgress = Math.min(
    1,
    Math.max(0, project.separationProgress ?? (stage === 'done' ? 1 : 0)),
  );
  const processingPercent =
    stage === 'progress' && normalizedProgress > 0
      ? clampPercent((project.separationProgress ?? 0) * 100)
      : stage === 'done'
        ? 100
        : undefined;

  const queueStatus: StageStatus = stage === 'pending' ? 'active' : 'done';
  const warmupStatus: StageStatus =
    stage === 'pending'
      ? 'waiting'
      : normalizedProgress === 0 && stage === 'progress'
        ? 'active'
        : 'done';
  const processingStatus: StageStatus =
    stage === 'progress' && normalizedProgress > 0 && normalizedProgress < 1
      ? 'active'
      : stage === 'done' || normalizedProgress >= 1
        ? 'done'
        : 'waiting';
  const deliveryStatus: StageStatus = stage === 'done' ? 'done' : 'waiting';

  return [
    {
      key: 'queue',
      title: t('pages.project.progress.steps.queue.label'),
      description: t('pages.project.progress.steps.queue.description'),
      status: queueStatus,
    },
    {
      key: 'warmup',
      title: t('pages.project.progress.steps.warmup.label'),
      description: t('pages.project.progress.steps.warmup.description'),
      status: warmupStatus,
    },
    {
      key: 'processing',
      title: t('pages.project.progress.steps.processing.label'),
      description: t('pages.project.progress.steps.processing.description'),
      status: processingStatus,
      percent: processingPercent,
    },
    {
      key: 'delivery',
      title: t('pages.project.progress.steps.delivery.label'),
      description: t('pages.project.progress.steps.delivery.description'),
      status: deliveryStatus,
    },
  ];
};

const buildPlaceholderStages = (t: TFunction): StageItem[] => [
  {
    key: 'queue',
    title: t('pages.project.progress.steps.queue.label'),
    description: t('pages.project.progress.steps.queue.description'),
    status: 'waiting',
  },
  {
    key: 'warmup',
    title: t('pages.project.progress.steps.warmup.label'),
    description: t('pages.project.progress.steps.warmup.description'),
    status: 'waiting',
  },
  {
    key: 'processing',
    title: t('pages.project.progress.steps.processing.label'),
    description: t('pages.project.progress.steps.processing.description'),
    status: 'waiting',
  },
  {
    key: 'delivery',
    title: t('pages.project.progress.steps.delivery.label'),
    description: t('pages.project.progress.steps.delivery.description'),
    status: 'waiting',
  },
];

const stageWeights: Record<StageKey, number> = {
  queue: 1,
  warmup: 1,
  processing: 1,
  delivery: 1,
};

const computeOverallPercent = (stages: StageItem[]) => {
  const totalWeight = Object.values(stageWeights).reduce((acc, w) => acc + w, 0);
  const weighted = stages.reduce((acc, stage) => {
    const weight = stageWeights[stage.key];
    const value = (() => {
      if (stage.status === 'done') return 1;
      if (stage.status === 'waiting') return 0;
      if (typeof stage.percent === 'number') return stage.percent / 100;
      return 0;
    })();
    return acc + value * weight;
  }, 0);

  return clampPercent((weighted / totalWeight) * 100);
};

type RailProps = {
  stages: StageItem[];
  statusLabels: Record<StageStatus, string>;
  celebrateFinish: boolean;
};
const StageRail: FC<RailProps> = ({
  stages,
  statusLabels,
  celebrateFinish,
}) => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const bubbleCompact = isCompact || isTablet;

  const columns = isCompact ? 2 : isTablet ? 2 : 4;

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 1.5, md: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {stages.map((stage) => (
          <StageBubble
            key={stage.key}
            stage={stage}
            statusLabels={statusLabels}
            celebrate={celebrateFinish}
            compact={bubbleCompact}
          />
        ))}
      </Box>
    </Box>
  );
};

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  overallPercent?: number;
  backLabel: string;
  overallLabel: string;
};
const ProgressLayout: FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  overallPercent,
  backLabel,
  overallLabel,
}) => {
  const theme = useTheme();
  return (
    <Stack
      width='100%'
      height='100dvh'
      alignItems='center'
      justifyContent='center'
      padding={{ xs: 3, sm: 4, md: 6 }}
      sx={{
        background: `radial-gradient(circle at 20% 20%, ${alpha(
          theme.palette.primary.main,
          0.04,
        )}, transparent 30%), radial-gradient(circle at 80% 10%, ${alpha(
          theme.palette.success.main,
          0.04,
        )}, transparent 26%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.9,
        )}, ${alpha(theme.palette.background.paper, 0.94)})`,
      }}
    >
      <Stack spacing={2.5} alignItems='center' width='100%' maxWidth={1180}>
        <Stack
          direction='row'
          alignItems='center'
          width='100%'
          gap={2}
        >
          <Button
            component={routes.home.Link}
            startIcon={<ArrowBackIcon />}
            variant='outlined'
            color='default'
          >
            {backLabel}
          </Button>
          <Box flexGrow={1} />
          {overallPercent !== undefined ? (
            <Box
              sx={{
                padding: theme.spacing(1.1, 1.4),
                borderRadius: 2,
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === 'dark' ? 0.12 : 0.06,
                ),
                minWidth: 150,
              }}
            >
              <Typography variant='caption' color='text.secondary'>
                {overallLabel}
              </Typography>
              <Typography variant='h5' fontWeight={800}>
                {overallPercent}%
              </Typography>
            </Box>
          ) : null}
        </Stack>
        <Stack spacing={1} alignItems='center' width='100%'>
          <Typography variant='h4' textAlign='center' fontWeight={800}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body1'
              color='text.secondary'
              textAlign='center'
              sx={{ maxWidth: 900, lineHeight: 1.6 }}
            >
              {subtitle}
            </Typography>
          ) : null}
          {overallPercent !== undefined ? (
            <Box
              sx={{
                width: '100%',
                mt: 0.5,
                position: 'relative',
                borderRadius: 999,
                backgroundColor: alpha(
                  theme.palette.text.primary,
                  theme.palette.mode === 'dark' ? 0.16 : 0.08,
                ),
                height: 10,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, ${alpha(
                    theme.palette.success.main,
                    0.9,
                  )}, ${alpha(theme.palette.primary.main, 0.9)})`,
                  width: `${overallPercent}%`,
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 18px ${alpha(
                    theme.palette.primary.main,
                    0.4,
                  )}`,
                }}
              />
            </Box>
          ) : null}
        </Stack>
        <Box width='100%'>{children}</Box>
      </Stack>
    </Stack>
  );
};

export type ProjectPageProgressProps = {
  project: UseQueryResult<api.project.Item>;
  isFinishing?: boolean;
};
export const ProjectPageProgress: FC<ProjectPageProgressProps> = ({
  project,
  isFinishing = false,
}) => {
  const { t } = useTranslation();
  const statusLabels: Record<StageStatus, string> = {
    active: t('pages.project.progress.status.live'),
    done: t('pages.project.progress.status.done'),
    waiting: t('pages.project.progress.status.waiting'),
  };

  const stages = useMemo(
    () =>
      project.data
        ? buildStages(project.data, t)
        : buildPlaceholderStages(t),
    [project.data, t],
  );
  const overallPercent = useMemo(
    () => computeOverallPercent(stages),
    [stages],
  );

  if (project.isError) {
    return (
      <ProgressLayout
        title={t('pages.project.progress.trackTitle')}
        subtitle={t('pages.project.progress.subTitle')}
        backLabel={t('pages.project.progress.backHome')}
        overallLabel={t('pages.project.progress.overall')}
      >
        <Stack
          alignItems='center'
          justifyContent='center'
          minHeight='60vh'
        >
          <QueryError error={project.error} />
        </Stack>
      </ProgressLayout>
    );
  }

  if (project.isPending || project.isLoading || !project.data) {
    return (
      <ProgressLayout
        title={t('pages.project.progress.trackTitle')}
        subtitle={t('pages.project.progress.subTitle')}
        backLabel={t('pages.project.progress.backHome')}
        overallLabel={t('pages.project.progress.overall')}
      >
        <Stack
          alignItems='center'
          justifyContent='center'
          spacing={2.5}
          minHeight='60vh'
        >
          <CircularProgressWithLabel size={120} thickness={3.6}>
            <Typography
              textAlign='center'
              variant='body2'
              sx={{ whiteSpace: 'pre-line' }}
            >
              {t('pages.project.progress.loading')}
            </Typography>
          </CircularProgressWithLabel>
          <Typography variant='body2' color='text.secondary'>
            {t('pages.project.progress.loadingHint')}
          </Typography>
        </Stack>
      </ProgressLayout>
    );
  }

  return (
    <ProgressLayout
      title={t('pages.project.progress.trackTitle')}
      subtitle={t('pages.project.progress.subTitle')}
      overallPercent={overallPercent}
      backLabel={t('pages.project.progress.backHome')}
      overallLabel={t('pages.project.progress.overall')}
    >
      <Stack spacing={3} position='relative' zIndex={1}>
        <StageRail
          stages={stages}
          statusLabels={statusLabels}
          celebrateFinish={isFinishing}
        />
      </Stack>
    </ProgressLayout>
  );
};
