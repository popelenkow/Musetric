import { createSpaRoute } from '@musetric/spa-router';
import { z } from 'zod/v4';

const toNumber = z.string().transform(Number).pipe(z.number());

export const routes = {
  home: createSpaRoute({
    path: { pattern: '/' },
  }),
  projects: createSpaRoute({
    path: { pattern: '/projects/*' },
  }),
  projectsCreate: createSpaRoute({
    path: { pattern: '/projects/create' },
  }),
  projectsEdit: createSpaRoute({
    path: {
      pattern: '/projects/rename/:projectId',
      parseNativeParams: (nativeParams) =>
        z.object({ projectId: toNumber }).parse(nativeParams),
    },
  }),
  projectsPreview: createSpaRoute({
    path: {
      pattern: '/projects/preview/:projectId',
      parseNativeParams: (nativeParams) =>
        z.object({ projectId: toNumber }).parse(nativeParams),
    },
  }),
  projectsDelete: createSpaRoute({
    path: {
      pattern: '/projects/delete/:projectId',
      parseNativeParams: (nativeParams) =>
        z.object({ projectId: toNumber }).parse(nativeParams),
    },
  }),
  project: createSpaRoute({
    path: {
      pattern: '/project/:projectId',
      parseNativeParams: (nativeParams) =>
        z.object({ projectId: toNumber }).parse(nativeParams),
    },
  }),
  notFound: createSpaRoute({
    path: { pattern: '/not-found' },
  }),
  any: createSpaRoute({
    path: { pattern: '*' },
  }),
} as const;
