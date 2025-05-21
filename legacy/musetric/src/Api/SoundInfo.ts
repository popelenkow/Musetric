export type SoundStem = 'vocals' | 'bass' | 'drums' | 'guitar' | 'piano' | 'other';
export const commonSampleRate = 44100;

export type SoundSeparationStatus = 'progress' | 'done';
export type SoundInfo = {
    id: string,
    fileName: string,
    status: SoundSeparationStatus,
};
