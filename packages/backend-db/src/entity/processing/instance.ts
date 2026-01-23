import type { DatabaseSync } from 'node:sqlite';
import { applySeparationResult } from './applySeparationResult.js';
import { applyTranscriptionResult } from './applyTranscriptionResult.js';
import { applyValidationResult } from './applyValidationResult.js';
import { pendingSeparation } from './pendingSeparation.js';
import { pendingTranscription } from './pendingTranscription.js';
import { pendingValidation } from './pendingValidation.js';

export const createInstance = (database: DatabaseSync) => ({
  pendingValidation: pendingValidation(database),
  pendingSeparation: pendingSeparation(database),
  pendingTranscription: pendingTranscription(database),
  applyValidationResult: applyValidationResult(database),
  applySeparationResult: applySeparationResult(database),
  applyTranscriptionResult: applyTranscriptionResult(database),
});
