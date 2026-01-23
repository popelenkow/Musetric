import type { api } from '@musetric/api';
import type { FastifyInstance } from 'fastify';

export type ProcessingStepKind = 'validation' | 'separation' | 'transcription';
export type ProcessingWorkerProgressEvent = {
  type: 'progress';
  projectId: number;
  step: ProcessingStepKind;
  progress: number;
  download?: api.project.Download;
};

export type ProcessingWorkerCompleteEvent = {
  type: 'complete';
  projectId: number;
  step: ProcessingStepKind;
};

export type ProcessingWorkerErrorEvent = {
  type: 'error';
  projectId: number;
  step: ProcessingStepKind;
};

export type ProcessingWorkerEvent =
  | ProcessingWorkerProgressEvent
  | ProcessingWorkerCompleteEvent
  | ProcessingWorkerErrorEvent;

export const resolveProcessingEvent = (
  event: ProcessingWorkerEvent,
): api.project.Processing => {
  if (event.type === 'progress') {
    if (event.step === 'validation') {
      return {
        done: false,
        steps: {
          validation: {
            status: 'processing',
            progress: event.progress,
            download: event.download,
          },
          separation: {
            status: 'pending',
          },
          transcription: {
            status: 'pending',
          },
        },
      };
    }

    if (event.step === 'separation') {
      return {
        done: false,
        steps: {
          validation: {
            status: 'done',
            progress: 1,
          },
          separation: {
            status: 'processing',
            progress: event.progress,
            download: event.download,
          },
          transcription: {
            status: 'pending',
          },
        },
      };
    }

    return {
      done: false,
      steps: {
        validation: {
          status: 'done',
          progress: 1,
        },
        separation: {
          status: 'done',
          progress: 1,
        },
        transcription: {
          status: 'processing',
          progress: event.progress,
          download: event.download,
        },
      },
    };
  }

  if (event.type === 'complete') {
    if (event.step === 'validation') {
      return {
        done: false,
        steps: {
          validation: { status: 'done', progress: 1 },
          separation: { status: 'pending' },
          transcription: { status: 'pending' },
        },
      };
    }

    if (event.step === 'separation') {
      return {
        done: false,
        steps: {
          validation: { status: 'done', progress: 1 },
          separation: { status: 'done', progress: 1 },
          transcription: { status: 'pending' },
        },
      };
    }

    return {
      done: true,
      steps: {
        validation: { status: 'done', progress: 1 },
        separation: { status: 'done', progress: 1 },
        transcription: { status: 'done', progress: 1 },
      },
    };
  }

  if (event.step === 'validation') {
    return {
      done: false,
      steps: {
        validation: { status: 'pending' },
        separation: { status: 'pending' },
        transcription: { status: 'pending' },
      },
    };
  }

  if (event.step === 'separation') {
    return {
      done: false,
      steps: {
        validation: { status: 'done', progress: 1 },
        separation: { status: 'pending' },
        transcription: { status: 'pending' },
      },
    };
  }

  return {
    done: false,
    steps: {
      validation: { status: 'done', progress: 1 },
      separation: { status: 'done', progress: 1 },
      transcription: { status: 'pending' },
    },
  };
};

export const resolveProcessing = async (
  app: FastifyInstance,
  projectId: number,
): Promise<api.project.Processing> => {
  const active = app.processingWorker.getProcessingState(projectId);
  if (active) {
    return resolveProcessingEvent(active);
  }

  const [subtitle, lead, sourceSound] = await Promise.all([
    app.db.subtitle.getByProject(projectId),
    app.db.sound.get(projectId, 'lead'),
    app.db.sound.get(projectId, 'source'),
  ]);

  if (subtitle) {
    return {
      done: true,
      steps: {
        validation: { status: 'done', progress: 1 },
        separation: { status: 'done', progress: 1 },
        transcription: { status: 'done', progress: 1 },
      },
    };
  }

  if (lead) {
    return {
      done: false,
      steps: {
        validation: { status: 'done', progress: 1 },
        separation: { status: 'done', progress: 1 },
        transcription: { status: 'pending' },
      },
    };
  }

  if (sourceSound) {
    return {
      done: false,
      steps: {
        validation: { status: 'done', progress: 1 },
        separation: { status: 'pending' },
        transcription: { status: 'pending' },
      },
    };
  }

  return {
    done: false,
    steps: {
      validation: { status: 'pending' },
      separation: { status: 'pending' },
      transcription: { status: 'pending' },
    },
  };
};
