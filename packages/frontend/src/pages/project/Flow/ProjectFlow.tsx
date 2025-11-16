import { Box, Stack } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectLayout } from '../components/ProjectPageLayout.js';
import { ProjectPageHeader } from './ProjectPageHeader.js';
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
  const overallProgressPercent = computeOverallPercent(project);

  return (
    <ProjectLayout isHeadingAbsolute>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
        padding={{ xs: 2.5, sm: 3.5, md: 4 }}
        flex={1}
      >
        <Stack
          width='100%'
          position='relative'
          zIndex={1}
          spacing={{ xs: 2.5, md: 3 }}
        >
          <ProjectPageHeader
            title={t('pages.project.progress.trackTitle')}
            subtitle={t('pages.project.progress.subTitle')}
            overallProgressPercent={overallProgressPercent}
            overallLabel={t('pages.project.progress.overall')}
          />
          <StagePanel>
            <StageRail stages={stages} />
          </StagePanel>
        </Stack>
      </Box>
    </ProjectLayout>
  );
};
