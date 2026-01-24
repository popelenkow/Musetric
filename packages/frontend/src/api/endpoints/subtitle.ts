import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number) =>
  queryOptions({
    queryKey: ['subtitle', 'get', projectId],
    queryFn: async () =>
      api.subtitle.get.request(axios, {
        params: { projectId },
      }),
  });
