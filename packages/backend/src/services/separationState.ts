type SeparationState = {
  projectId: number;
  blobId: string;
  progress: number;
  stage: string;
};

const separationStates = new Map<number, SeparationState>();

export const setSeparationProgress = (
  projectId: number,
  progress: number,
  stage: string,
  blobId?: string,
) => {
  const existingState = separationStates.get(projectId);
  separationStates.set(projectId, {
    projectId,
    blobId: blobId || existingState?.blobId || '',
    progress,
    stage,
  });
};

export const getSeparationProgress = (
  projectId: number,
): SeparationState | undefined => {
  return separationStates.get(projectId);
};

export const clearSeparationProgress = (projectId: number) => {
  separationStates.delete(projectId);
};

export const getAllSeparationStates = (): SeparationState[] => {
  return Array.from(separationStates.values());
};

export const isAnyProjectProcessing = (): boolean => {
  return separationStates.size > 0;
};

export const getProcessingProject = (): number | undefined => {
  for (const state of separationStates.values()) {
    return state.projectId;
  }
  return undefined;
};
