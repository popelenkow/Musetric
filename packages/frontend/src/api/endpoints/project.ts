import { api } from '@musetric/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { mutationOptions } from '../queryClient.js';

export const getProjects = () =>
  queryOptions({
    queryKey: ['getProjects'],
    queryFn: async () => api.project.list.request(axios, {}),
  });

export const getProject = (projectId: number) =>
  queryOptions({
    queryKey: ['getProject', projectId],
    queryFn: async () =>
      api.project.get.request(axios, {
        params: { projectId },
      }),
  });

export const subscribeToProjectStatus = (queryClient: QueryClient) =>
  api.project.status.event.subscribe((event) => {
    const applyEvent = (project: api.project.Item): api.project.Item => ({
      ...project,
      stage: event.stage,
      progress: 'progress' in event ? event.progress : undefined,
    });

    queryClient.setQueryData(getProjects().queryKey, (projects) => {
      if (!projects) {
        return projects;
      }
      return projects.map((project) =>
        project.id === event.projectId ? applyEvent(project) : project,
      );
    });

    queryClient.setQueryData(
      getProject(event.projectId).queryKey,
      (project) => {
        if (!project) {
          return project;
        }
        return applyEvent(project);
      },
    );
  });

export const createProject = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ['createProject'],
    mutationFn: async (data: api.project.create.Request) =>
      api.project.create.request(axios, {
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjects().queryKey, (projects = []) => [
        newProject,
        ...projects,
      ]);
    },
  });

export const editProject = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['editProject', projectId],
    mutationFn: async (data: api.project.edit.Request) =>
      api.project.edit.request(axios, {
        params: { projectId },
        data,
      }),
    onSuccess: (newProject) => {
      queryClient.setQueryData(getProjects().queryKey, (projects) =>
        projects?.map((x) => (x.id === newProject.id ? newProject : x)),
      );
    },
  });

export const deleteProject = (queryClient: QueryClient, projectId: number) =>
  mutationOptions({
    mutationKey: ['deleteProject', projectId],
    mutationFn: async () =>
      api.project.remove.request(axios, {
        params: { projectId },
      }),
    onSuccess: () => {
      queryClient.setQueryData(getProjects().queryKey, (projects) =>
        projects?.filter((x) => x.id !== projectId),
      );
    },
  });
