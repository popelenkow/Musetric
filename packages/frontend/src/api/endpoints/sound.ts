import { SoundType } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';

export const addOriginalSoundApi = (projectId: number) =>
  mutationOptions({
    mutationKey: ['addOriginalSoundApi', projectId],
    mutationFn: async (fileBody: File) => {
      const formData = new FormData();
      formData.append('file', fileBody);
      await axios.post<void>(`/api/sound/${projectId}/original`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

export const getSoundApi = (projectId: number, soundType: SoundType) =>
  queryOptions({
    queryKey: ['getSoundApi', projectId, soundType],
    queryFn: async () => {
      const response = await axios.get<unknown>(
        `/api/sound/${projectId}/${soundType}`,
      );
      return response.data;
    },
  });
