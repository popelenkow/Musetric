import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient.js';

export const list = () =>
  queryOptions({
    queryKey: ['project', 'list'],
    queryFn: async () => api.project.list.request(axios, {}),
  });

export const get = (projectId: number) =>
  queryOptions({
    queryKey: ['project', 'get', projectId],
    queryFn: async () =>
      api.project.get.request(axios, {
        params: { projectId },
      }),
  });

export const subscribeToStatus = (queryClient: QueryClient) =>
  api.project.status.event.subscribe((event) => {
    const applyEvent = (projectItem: api.project.Item): api.project.Item => ({
      ...projectItem,
      processing: event.processing,
    });

    queryClient.setQueryData(list().queryKey, (projects) => {
      if (!projects) {
        return projects;
      }
      return projects.map((projectItem) =>
        projectItem.id === event.projectId
          ? applyEvent(projectItem)
          : projectItem,
      );
    });

    queryClient.setQueryData(get(event.projectId).queryKey, (projectItem) => {
      if (!projectItem) {
        return projectItem;
      }
      return applyEvent(projectItem);
    });
  });

export const create = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['project', 'create'],
    mutationFn: async (data: api.project.create.Request) =>
      api.project.create.request(axios, {
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(list().queryKey, (projects = []) => [
        newProject,
        ...projects,
      ]);
    },
  });

export const edit = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['project', 'edit', projectId],
    mutationFn: async (data: api.project.edit.Request) =>
      api.project.edit.request(axios, {
        params: { projectId },
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(list().queryKey, (projects) =>
        projects?.map((x) => (x.id === newProject.id ? newProject : x)),
      );
    },
  });

export const remove = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['project', 'remove', projectId],
    mutationFn: async () =>
      api.project.remove.request(axios, {
        params: { projectId },
      }),
    onSuccess: () => {
      queryClient.setQueryData(list().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
