import { Stack } from '@mui/material';
import { api } from '@musetric/api';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectFlowLayout } from './ProjectFlowLayout.js';
import { computeOverallPercent } from './stageProgress.js';
import { StageRail } from './StageRail.js';

export type ProjectFlowProps = {
  project: api.project.Item;
  children: ReactNode;
};

export const ProjectFlow: FC<ProjectFlowProps> = (props) => {
  const { project, children } = props;
  const { t } = useTranslation();
  const finishAnimationDurationMs = 2600;

  const [showFinishCelebration, setShowFinishCelebration] = useState(false);
  const initialStageRef = useRef<'pending' | 'progress' | 'done' | undefined>(
    undefined,
  );
  const hasObservedWorkRef = useRef(false);
  const previousStageRef = useRef<
    'pending' | 'progress' | 'done' | undefined
  >(undefined);

  const currentStage = project.stage;

  if (!initialStageRef.current && currentStage) {
    initialStageRef.current = currentStage;
  }

  if (currentStage && currentStage !== 'done') {
    hasObservedWorkRef.current = true;
  }

  useEffect(() => {
    let timeoutId: number | undefined = undefined;

    const finishedDuringSession =
      currentStage === 'done' &&
      hasObservedWorkRef.current &&
      previousStageRef.current &&
      previousStageRef.current !== 'done';

    if (finishedDuringSession) {
      setShowFinishCelebration(true);
      timeoutId = window.setTimeout(
        () => setShowFinishCelebration(false),
        finishAnimationDurationMs,
      );
    } else if (currentStage !== 'done') {
      setShowFinishCelebration(false);
    }

    previousStageRef.current = currentStage;

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [currentStage]);

  const isInitiallyDoneWithoutRun =
    initialStageRef.current === 'done' && !hasObservedWorkRef.current;
  const shouldShowProgress =
    (currentStage !== 'done' || showFinishCelebration) &&
    !isInitiallyDoneWithoutRun;

  if (!shouldShowProgress) {
    return <>{children}</>;
  }

  const overallProgressPercent = computeOverallPercent(project);

  return (
    <ProjectFlowLayout
      pageTitle={t('pages.project.progress.trackTitle')}
      pageSubtitle={t('pages.project.progress.subTitle')}
      overallProgressPercent={overallProgressPercent}
      backButtonLabel={t('pages.project.progress.backHome')}
      overallProgressLabel={t('pages.project.progress.overall')}
    >
      <Stack spacing={3} position='relative' zIndex={1}>
        <StageRail project={project} isFinishing={showFinishCelebration} />
      </Stack>
    </ProjectFlowLayout>
  );
};
