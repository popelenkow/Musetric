import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';

export const getProjectsApi = () =>
  queryOptions({
    queryKey: ['getProjectsApi'],
    queryFn: () => api.project.list.request(axios, {}),
  });

export const getProjectApi = (projectId: number) =>
  queryOptions({
    queryKey: ['getProjectApi', projectId],
    queryFn: () =>
      api.project.get.request(axios, {
        params: { projectId },
      }),
  });

export const createProjectApi = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['createProjectApi'],
    mutationFn: (data: api.project.create.Request) =>
      api.project.create.request(axios, {
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjectsApi().queryKey, (projects = []) => [
        newProject,
        ...projects,
      ]);
    },
  });

export const editProjectApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['editProjectApi', projectId],
    mutationFn: (data: api.project.edit.Request) =>
      api.project.edit.request(axios, {
        params: { projectId },
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjectsApi().queryKey, (projects) =>
        projects?.map((x) => (x.id === newProject.id ? newProject : x)),
      );
    },
  });

export const deleteProjectApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['deleteProjectApi', projectId],
    mutationFn: () =>
      api.project.remove.request(axios, {
        params: { projectId },
      }),
    onSuccess: () => {
      queryClient.setQueryData(getProjectsApi().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
