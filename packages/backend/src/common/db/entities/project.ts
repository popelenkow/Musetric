import { BlobFile } from '@musetric/resource-utils/blobStorage';
import { PrismaClient } from '@prisma/client';

export type ProjectStage = 'pending' | 'done';
export type SoundType = 'original' | 'vocal' | 'instrumental';

export type Project = {
  id: number;
  name: string;
  stage: ProjectStage;
};

export type Preview = {
  id: number;
  projectId: number;
  blobId: string;
  filename: string;
  contentType: string;
};

export type GetItem = Project & {
  preview?: Preview;
};
export type ListItem = GetItem;

export type CreateItem = {
  project: Project;
  preview?: Preview;
};
export type UpdateItem = CreateItem;

export type CreateArg = {
  name: string;
  song: BlobFile;
  preview?: BlobFile;
};

export type UpdateArg = {
  projectId: number;
  name?: string;
  preview?: BlobFile;
  withoutPreview?: boolean;
};

export const create = (prisma: PrismaClient) => {
  return {
    list: async (): Promise<ListItem[]> => {
      const projects = await prisma.project.findMany({
        orderBy: { id: 'desc' },
        include: { preview: true },
      });

      return projects.map(
        (project): ListItem => ({
          ...project,
          preview: project.preview ?? undefined,
        }),
      );
    },
    get: async (projectId: number): Promise<ListItem | undefined> => {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { preview: true },
      });

      if (!project) {
        return undefined;
      }

      return {
        ...project,
        preview: project.preview ?? undefined,
      };
    },
    create: async (arg: CreateArg): Promise<UpdateItem> => {
      return prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            name: arg.name,
            stage: 'pending',
          },
        });

        await tx.sound.create({
          data: {
            projectId: project.id,
            blobId: arg.song.blobId,
            filename: arg.song.filename,
            contentType: arg.song.contentType,
            type: 'original',
          },
        });

        if (!arg.preview) {
          return { project, preview: undefined };
        }

        const preview = await tx.preview.create({
          data: {
            projectId: project.id,
            ...arg.preview,
          },
        });

        return {
          project,
          preview,
        };
      });
    },
    update: async (arg: UpdateArg): Promise<UpdateItem | undefined> => {
      const { projectId, name, preview, withoutPreview } = arg;

      return prisma.$transaction(async (tx) => {
        const existing = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });

        if (!existing) {
          return undefined;
        }

        const existingPreview = existing.preview ? existing.preview : undefined;

        const project = name
          ? await tx.project.update({
              where: { id: projectId },
              data: { name },
            })
          : existing;

        if (existing.preview && (preview || withoutPreview)) {
          await tx.preview.delete({
            where: { projectId },
          });
        }

        if (withoutPreview) {
          return { project, preview: undefined };
        }

        if (preview) {
          const createdPreview = await tx.preview.create({
            data: {
              projectId,
              ...preview,
            },
          });

          return {
            project,
            preview: createdPreview,
          };
        }

        return {
          project,
          preview: existingPreview,
        };
      });
    },
    remove: async (projectId: number): Promise<number> => {
      const { count } = await prisma.project.deleteMany({
        where: { id: projectId },
      });
      return count;
    },
  };
};
