import { separateProjectAudio } from '../services/separationService';
import { prisma } from './prisma';

const processProjectSeparation = async (projectId: number) => {
  console.log(`Processing project ${projectId}`);

  try {
    await separateProjectAudio({ projectId });
    console.log(`Project ${projectId} processing completed successfully`);
  } catch (error) {
    console.error(`Audio separation failed for project ${projectId}:`, error);
    // Reset stage to init for retry
    await prisma.project.update({
      where: { id: projectId },
      data: { stage: 'init' },
    });
  }
};

const processSeparationQueue = async () => {
  console.log('Checking for projects to process...');

  const pendingProjects = await prisma.project.findMany({
    where: { stage: 'init' },
    include: { sounds: true },
  });

  console.log(`Found ${pendingProjects.length} projects to process`);

  for (const project of pendingProjects) {
    try {
      await processProjectSeparation(project.id);
    } catch (error) {
      console.error(`Failed to process project ${project.id}:`, error);
    }
  }
};

// Start background worker
let workerInterval: NodeJS.Timeout | undefined = undefined;

export const startSeparationWorker = () => {
  if (workerInterval) {
    console.log('Separation worker already running');
    return;
  }

  console.log('Starting separation worker...');

  // Run immediately
  void processSeparationQueue();

  // Then run every 30 seconds
  workerInterval = setInterval(() => {
    void processSeparationQueue();
  }, 30000);
};

export const stopSeparationWorker = () => {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = undefined;
    console.log('Separation worker stopped');
  }
};
