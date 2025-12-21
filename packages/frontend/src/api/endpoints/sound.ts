import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient.js';

export const addOriginalSound = (projectId: number) =>
  mutationOptions({
    mutationKey: ['addOriginalSound', projectId],
    mutationFn: async (file: File) =>
      api.sound.upload.request(axios, {
        params: { projectId },
        data: { file },
      }),
  });

export const getSound = (projectId: number, type: api.sound.Type) =>
  queryOptions({
    queryKey: ['getSound', projectId, type],
    queryFn: async () =>
      api.sound.get.request(axios, {
        params: { projectId, type },
      }),
  });
