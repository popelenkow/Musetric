import { api } from '@musetric/api';
import { requestWithAxios } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number, type: api.audioMaster.Type) =>
  queryOptions({
    queryKey: ['audioMaster', 'get', projectId, type],
    queryFn: async () =>
      requestWithAxios(axios, api.audioMaster.get.base, {
        params: { projectId, type },
      }),
  });
