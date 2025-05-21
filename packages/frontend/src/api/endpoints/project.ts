import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient';

export const getProjectInfosApi = () =>
  queryOptions({
    queryKey: ['getProjectInfosApi'],
    queryFn: async () => {
      const response = await axios.get<api.project.list.Response>(
        api.project.list.endpoint(),
      );
      return response.data;
    },
  });

export const getProjectInfoApi = (projectId: number) =>
  queryOptions({
    queryKey: ['getProjectInfoApi', projectId],
    queryFn: async () => {
      const response = await axios.get<api.project.get.Response>(
        api.project.get.endpoint(projectId),
      );
      return response.data;
    },
  });

export const createProjectApi = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['createProjectApi'],
    mutationFn: async (name: string) => {
      const request: api.project.create.Request = { name };
      const response = await axios.post<api.project.create.Response>(
        api.project.create.endpoint(),
        request,
      );
      return response.data;
    },
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
    mutationFn: async (name: string) => {
      const request: api.project.rename.Request = { name };
      const response = await axios.post<api.project.rename.Response>(
        api.project.rename.endpoint(projectId),
        request,
      );
      return response.data;
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjectInfosApi().queryKey, (projects) =>
        projects?.map((x) => (x.id === newProject.id ? newProject : x)),
      );
    },
  });

export const deleteProjectApi = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['deleteProjectApi', projectId],
    mutationFn: async () => {
      await axios.delete<void>(api.project.remove.endpoint(projectId));
    },
    onSuccess: () => {
      queryClient.setQueryData(getProjectInfosApi().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
