import { api } from '@musetric/api';
import { useEffect, useRef, useState } from 'react';

const finishAnimationDurationMs = 2600;

export const useProjectFinishAnimation = (project?: api.project.Item) => {
  const initialStageRef = useRef<api.project.Item['stage'] | undefined>(
    undefined,
  );
  const hasObservedWorkRef = useRef(false);
  const previousStageRef = useRef<api.project.Item['stage'] | undefined>(
    undefined,
  );
  const finishAnimationTimeoutRef = useRef<number | undefined>(undefined);
  const [finishAnimationActive, setFinishAnimationActive] = useState(false);

  useEffect(() => {
    if (!project?.stage) {
      return undefined;
    }

    if (!initialStageRef.current) {
      initialStageRef.current = project.stage;
    }

    if (project.stage !== 'done') {
      hasObservedWorkRef.current = true;
    }

    const finishedDuringSession =
      project.stage === 'done' &&
      hasObservedWorkRef.current &&
      previousStageRef.current &&
      previousStageRef.current !== 'done';

    if (finishedDuringSession) {
      setFinishAnimationActive(true);
      finishAnimationTimeoutRef.current = window.setTimeout(() => {
        setFinishAnimationActive(false);
        finishAnimationTimeoutRef.current = undefined;
      }, finishAnimationDurationMs);
    } else if (project.stage !== 'done') {
      setFinishAnimationActive(false);
      finishAnimationTimeoutRef.current = undefined;
    }

    previousStageRef.current = project.stage;

    return () => {
      if (finishAnimationTimeoutRef.current !== undefined) {
        window.clearTimeout(finishAnimationTimeoutRef.current);
        finishAnimationTimeoutRef.current = undefined;
      }
    };
  }, [project?.stage]);

  const isInitiallyDoneWithoutRun =
    initialStageRef.current === 'done' && !hasObservedWorkRef.current;
  const finishedDuringThisRender =
    project?.stage === 'done' &&
    hasObservedWorkRef.current &&
    previousStageRef.current &&
    previousStageRef.current !== 'done';

  return {
    shouldShowFinishAnimation:
      Boolean(project) &&
      !isInitiallyDoneWithoutRun &&
      (finishAnimationActive || finishedDuringThisRender),
  };
};
