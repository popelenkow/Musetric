import { api } from '@musetric/api';
import axios from 'axios';
import { mutationOptions } from '../queryClient';

export const addOriginalSoundApi = (projectId: number) =>
  mutationOptions({
    mutationKey: ['addOriginalSoundApi', projectId],
    mutationFn: (file: File) =>
      api.sound.upload.request(axios, {
        params: { projectId },
        data: { file },
      }),
  });
