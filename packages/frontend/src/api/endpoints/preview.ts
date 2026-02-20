import { api } from '@musetric/api';
import { requestWithAxios } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (previewId: number) =>
  queryOptions({
    queryKey: ['preview', 'get', previewId],
    queryFn: async () =>
      requestWithAxios(axios, api.preview.get.base, {
        params: { previewId },
      }),
  });
