import { api } from '@musetric/api';
import { requestWithAxios } from '@musetric/api/dom';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const get = (projectId: number, type: api.audioDelivery.Type) =>
  queryOptions({
    queryKey: ['audioDelivery', 'get', projectId, type],
    queryFn: async () =>
      requestWithAxios(axios, api.audioDelivery.get.base, {
        params: { projectId, type },
      }),
  });
