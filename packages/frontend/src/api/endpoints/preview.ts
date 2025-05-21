import { api, ProjectInfo } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';
import { getProjectInfosApi } from './project';

export const getPreviewUrl = <T extends number | undefined>(
  previewId: T,
): T extends number ? string : undefined =>
  // ToDO: https://github.com/microsoft/TypeScript/issues/33912
  // eslint-disable-next-line
  (previewId ? `/api/preview/${previewId}` : undefined) as any;

export const getPreviewApi = (previewId: number) =>
  queryOptions({
    queryKey: ['getPreviewApi', previewId],
    queryFn: async () => {
      const response = await axios.get<unknown>(getPreviewUrl(previewId));
      return response.data;
    },
  });

export const changePreviewApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['changePreviewApi', projectId],
    mutationFn: async (fileBody?: File) => {
      if (!fileBody) {
        const response = await axios.post<api.preview.upload.Response>(
          api.preview.upload.endpoint(projectId),
        );
        return response.data;
      }
      const formData = new FormData();
      formData.append('file', fileBody);
      const response = await axios.post<ProjectInfo>(
        api.preview.upload.endpoint(projectId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return response.data;
    },
    onSuccess: (newPreview) => {
      queryClient.setQueryData(getProjectInfosApi().queryKey, (projects) =>
        projects?.map((x) =>
          x.id === projectId ? { ...x, previewId: newPreview.id } : x,
        ),
      );
    },
  });
