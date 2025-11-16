import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect, useRef, useState } from 'react';
import {
  getProjectApi,
  subscribeToProjectStatus,
} from '../../api/endpoints/project.js';
import { routes } from '../../app/router/routes.js';
import { ProjectPageContent } from './ProjectPageContent.js';
import { ProjectPageProgress } from './ProjectPageProgress.js';

const FINISH_ANIMATION_DURATION = 2600;

export const ProjectPage: FC = () => {
  const queryClient = useQueryClient();

  const { projectId } = routes.project.useAssertMatch();
  const project = useQuery(getProjectApi(projectId));
  const [showFinishCelebration, setShowFinishCelebration] = useState(false);
  const initialStageRef = useRef<'pending' | 'progress' | 'done' | undefined>(
    undefined,
  );
  const hasObservedWorkRef = useRef(false);
  const previousStageRef = useRef<
    'pending' | 'progress' | 'done' | undefined
  >(undefined);

  useEffect(() => subscribeToProjectStatus(queryClient), [queryClient]);

  const currentStage = project.data?.stage;

  if (!initialStageRef.current && currentStage) {
    initialStageRef.current = currentStage;
  }

  if (currentStage && currentStage !== 'done') {
    hasObservedWorkRef.current = true;
  }

  useEffect(() => {
    let timeoutId: number | undefined;

    const finishedDuringSession =
      currentStage === 'done' &&
      hasObservedWorkRef.current &&
      previousStageRef.current &&
      previousStageRef.current !== 'done';

    if (finishedDuringSession) {
      setShowFinishCelebration(true);
      timeoutId = window.setTimeout(
        () => setShowFinishCelebration(false),
        FINISH_ANIMATION_DURATION,
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

  if (shouldShowProgress || !project.data) {
    return (
      <ProjectPageProgress
        project={project}
        isFinishing={showFinishCelebration}
      />
    );
  }

  return <ProjectPageContent project={project.data} />;
};
