import { Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CelebrationBackdrop } from './finish/CelebrationBackdrop.js';
import { CelebrationCard } from './finish/CelebrationCard.js';
import { ConfettiLayer, ConfettiPiece } from './finish/ConfettiLayer.js';
import { ProjectFlowLayout } from './ProjectFlowLayout.js';
import { StagePanel } from './stage/StagePanel.js';
import { buildStageItems, computeOverallPercent } from './stage/stageProgress.js';
import { StageRail } from './stage/StageRail.js';

const confettiPieces: ConfettiPiece[] = [
  { left: '6%', delay: 0 },
  { left: '16%', delay: 120 },
  { left: '26%', delay: 220 },
  { left: '38%', delay: 320 },
  { left: '50%', delay: 420 },
  { left: '62%', delay: 540 },
  { left: '74%', delay: 660 },
  { left: '84%', delay: 780 },
  { left: '94%', delay: 900 },
];

export type ProjectFlowFinishProps = {
  project: api.project.Item;
};

export const ProjectFlowFinish: FC<ProjectFlowFinishProps> = (props) => {
  const { project } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const accent = theme.palette.success.main;
  const stages = buildStageItems(project, t);
  const badgeLabels = [
    t('pages.project.finish.badges.audio'),
    t('pages.project.finish.badges.preview'),
    t('pages.project.finish.badges.launch'),
  ];

  return (
    <ProjectFlowLayout
      variant='progress'
      overallProgressPercent={computeOverallPercent(project)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1180,
          mx: 'auto',
          overflow: 'hidden',
        }}
      >
        <CelebrationBackdrop accent={accent} />
        <ConfettiLayer pieces={confettiPieces} />
        <Stack
          spacing={{ xs: 3, md: 4 }}
          position='relative'
          zIndex={1}
        >
          <CelebrationCard
            accent={accent}
            badgeLabels={badgeLabels}
            statusLabel={t('pages.project.progress.status.done')}
            title={t('pages.project.finish.title', { name: project.name })}
            subtitle={t('pages.project.finish.subtitle')}
            detail={t('pages.project.finish.detail')}
          />
          <StagePanel
            title={t('pages.project.finish.stagesTitle')}
            hint={t('pages.project.finish.stagesHint')}
          >
            <StageRail stages={stages} celebrateDelivery />
          </StagePanel>
        </Stack>
      </Box>
    </ProjectFlowLayout>
  );
};
