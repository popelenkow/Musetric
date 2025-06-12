import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';

export const getProjectInfosApi = () =>
  queryOptions({
    queryKey: ['getProjectInfosApi'],
    queryFn: () => api.project.list.request(axios, {}),
  });

export const getProjectInfoApi = (projectId: number) =>
  queryOptions({
    queryKey: ['getProjectInfoApi', projectId],
    queryFn: () =>
      api.project.get.request(axios, {
        params: { projectId },
      }),
  });

export const createProjectApi = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['createProjectApi'],
    mutationFn: (file: File) =>
      api.project.create.request(axios, {
        data: { file },
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(
        getProjectInfosApi().queryKey,
        (projects = []) => [newProject, ...projects],
      );
    },
  });

export const renameProjectApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['renameProjectApi', projectId],
    mutationFn: (name: string) =>
      api.project.rename.request(axios, {
        params: { projectId },
        data: { name },
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjectInfosApi().queryKey, (projects) =>
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
      queryClient.setQueryData(getProjectInfosApi().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
