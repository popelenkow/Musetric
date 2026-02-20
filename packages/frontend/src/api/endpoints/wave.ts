import { api } from '@musetric/api';
import { requestWithAxios } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number, type: api.wave.Type) =>
  queryOptions({
    queryKey: ['wave', 'get', projectId, type],
    queryFn: async () =>
      requestWithAxios(axios, api.wave.get.base, {
        params: { projectId, type },
      }),
  });
