import { api } from '@musetric/api';
import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getSubtitle = (projectId: number) =>
  queryOptions({
    queryKey: ['getSubtitle', projectId],
    queryFn: async () =>
      api.subtitle.get.request(axios, {
        params: { projectId },
      }),
  });
