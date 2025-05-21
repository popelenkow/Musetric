export type CreateProjectArgs = {
  name: string;
};

export type ProjectInfo = {
  id: number;
  name: string;
  stage: 'init' | 'pending' | 'progress' | 'done';
  previewId?: number;
};

export type SoundType = 'original' | 'vocal' | 'instrumental';
