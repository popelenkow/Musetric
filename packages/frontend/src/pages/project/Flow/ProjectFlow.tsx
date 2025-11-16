import { Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectFlowLayout } from './ProjectFlowLayout.js';
import { StagePanel } from './stage/StagePanel.js';
import { buildStageItems, computeOverallPercent } from './stage/stageProgress.js';
import { StageRail } from './stage/StageRail.js';

export type ProjectFlowProps = {
  project: api.project.Item;
};

export const ProjectFlow: FC<ProjectFlowProps> = (props) => {
  const { project } = props;
  const { t } = useTranslation();
  const stages = buildStageItems(project, t);
  const activeStage =
    stages.find((stage) => stage.status === 'active') ??
    stages.find((stage) => stage.status === 'waiting') ??
    stages[0];
  const insightItems = [
    {
      title: t('pages.project.progress.insights.nowTitle', {
        stage: activeStage?.title ?? t('pages.project.progress.trackTitle'),
      }),
      description: t('pages.project.progress.insights.nowDescription'),
    },
    {
      title: t('pages.project.progress.insights.futureTitle'),
      description: t('pages.project.progress.insights.futureDescription'),
    },
    {
      title: t('pages.project.progress.insights.controlTitle'),
      description: t('pages.project.progress.insights.controlDescription'),
    },
  ];

  return (
    <ProjectFlowLayout
      variant='progress'
      overallProgressPercent={computeOverallPercent(project)}
    >
      <Stack spacing={3} position='relative' zIndex={1}>
        <StagePanel>
          <StageRail stages={stages} />
        </StagePanel>
        <StagePanel>
          <Stack spacing={1.6}>
            {insightItems.map((item) => (
              <Stack key={item.title} spacing={0.4}>
                <Typography variant='subtitle2' fontWeight={800}>
                  {item.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {item.description}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </StagePanel>
      </Stack>
    </ProjectFlowLayout>
  );
};
