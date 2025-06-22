import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getPreviewApi = (previewId: number) =>
  queryOptions({
    queryKey: ['getPreviewApi', previewId],
    queryFn: () =>
      api.preview.get.request(axios, {
        params: { previewId },
      }),
  });
