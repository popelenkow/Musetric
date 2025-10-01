import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient.js';

export const addOriginalSoundApi = (projectId: number) =>
  mutationOptions({
    mutationKey: ['addOriginalSoundApi', projectId],
    mutationFn: async (file: File) =>
      api.sound.upload.request(axios, {
        params: { projectId },
        data: { file },
      }),
  });

export const getSoundApi = (projectId: number, type: api.sound.Type) =>
  queryOptions({
    queryKey: ['getSoundApi', projectId, type],
    queryFn: async () =>
      api.sound.get.request(axios, {
        params: { projectId, type },
      }),
  });
