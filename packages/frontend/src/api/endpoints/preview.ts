import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getPreview = (previewId: number) =>
  queryOptions({
    queryKey: ['getPreview', previewId],
    queryFn: async () =>
      api.preview.get.request(axios, {
        params: { previewId },
      }),
  });
