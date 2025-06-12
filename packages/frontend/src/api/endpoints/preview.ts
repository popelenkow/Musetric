import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';
import { getProjectsApi } from './project';

export const getPreviewApi = (previewId: number) =>
  queryOptions({
    queryKey: ['getPreviewApi', previewId],
    queryFn: () =>
      api.preview.get.request(axios, {
        params: { previewId },
      }),
  });

export const changePreviewApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['changePreviewApi', projectId],
    mutationFn: (file: File) =>
      api.preview.upload.request(axios, {
        params: { projectId },
        data: { file },
      }),
    onSuccess: (newPreview) => {
      queryClient.setQueryData(getProjectsApi().queryKey, (projects) =>
        projects?.map((x) =>
          x.id === projectId ? { ...x, previewId: newPreview.id } : x,
        ),
      );
    },
  });
