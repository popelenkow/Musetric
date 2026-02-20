import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number, type: api.audioMaster.Type) =>
  queryOptions({
    queryKey: ['audioMaster', 'get', projectId, type],
    queryFn: async () =>
      api.audioMaster.get.request(axios, {
        params: { projectId, type },
      }),
  });
