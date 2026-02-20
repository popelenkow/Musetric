import { api } from '@musetric/api';
import { requestWithAxios } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number) =>
  queryOptions({
    queryKey: ['subtitle', 'get', projectId],
    queryFn: async () =>
      requestWithAxios(axios, api.subtitle.get.base, {
        params: { projectId },
      }),
  });
