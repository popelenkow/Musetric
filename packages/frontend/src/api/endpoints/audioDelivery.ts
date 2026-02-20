import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number, type: api.audioDelivery.Type) =>
  queryOptions({
    queryKey: ['audioDelivery', 'get', projectId, type],
    queryFn: async () =>
      api.audioDelivery.get.request(axios, {
        params: { projectId, type },
      }),
  });
