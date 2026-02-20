import { api } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (previewId: number) =>
  queryOptions({
    queryKey: ['preview', 'get', previewId],
    queryFn: async () =>
      api.preview.get.request(axios, {
        params: { previewId },
      }),
  });
