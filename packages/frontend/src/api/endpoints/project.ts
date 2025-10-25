import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient.js';

export const getProjectsApi = () =>
  queryOptions({
    queryKey: ['getProjectsApi'],
    queryFn: async () => api.project.list.request(axios, {}),
  });

export const getProjectApi = (projectId: number) =>
  queryOptions({
    queryKey: ['getProjectApi', projectId],
    queryFn: async () =>
      api.project.get.request(axios, {
        params: { projectId },
      }),
  });

export const subscribeToProjectStatus = (queryClient: QueryClient) =>
  api.project.status.event.subscribe((event) => {
    const applyEvent = (project: api.project.Item) => ({
      ...project,
      stage: event.stage,
      separationProgress:
        event.stage === 'progress' ? event.progress : undefined,
    });

    queryClient.setQueryData(getProjectsApi().queryKey, (projects) => {
      if (!projects) {
        return projects;
      }
      return projects.map((project) =>
        project.id === event.projectId ? applyEvent(project) : project,
      );
    });

    queryClient.setQueryData(
      getProjectApi(event.projectId).queryKey,
      (project) => {
        if (!project) {
          return project;
        }
        return applyEvent(project);
      },
    );
  });

export const createProjectApi = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['createProjectApi'],
    mutationFn: async (data: api.project.create.Request) =>
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
    mutationFn: async (data: api.project.edit.Request) =>
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
    mutationFn: async () =>
      api.project.remove.request(axios, {
        params: { projectId },
      }),
    onSuccess: () => {
      queryClient.setQueryData(getProjectsApi().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
