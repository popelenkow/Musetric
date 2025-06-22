import { Prisma } from '@prisma/client';

export const createPreview = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  file?: File,
) => {
  if (!file) return undefined;
  const previewArrayBuffer = await file.arrayBuffer();
  const previewData = Buffer.from(previewArrayBuffer);
  const result = await tx.preview.create({
    data: {
      projectId,
      data: previewData,
      filename: file.name,
      contentType: file.type,
    },
  });
  return result;
};

export const changePreview = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  file?: File,
  withoutPreview?: boolean,
) => {
  if (file) {
    await tx.preview.deleteMany({
      where: { projectId },
    });
    return createPreview(tx, projectId, file);
  }

  if (withoutPreview) {
    await tx.preview.deleteMany({
      where: { projectId },
    });
    return undefined;
  }

  return await tx.preview.findUnique({
    where: { projectId },
  });
};
