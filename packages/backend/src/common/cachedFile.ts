import crypto from 'crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type CachedFile = {
  data: crypto.BinaryLike;
  filename: string;
  contentType: string;
};

export const handleCachedFile = (
  request: FastifyRequest,
  reply: FastifyReply,
  file: CachedFile,
): boolean => {
  const etag = crypto.createHash('md5').update(file.data).digest('hex');

  reply.headers({
    'content-type': file.contentType,
    'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    'cache-control': 'public, max-age=86400',
    etag,
  });

  const clearTag = (tag: string) => {
    const trimmed = tag.trim();
    return trimmed.replace(/^["'](.*)["']$/, '$1');
  };
  const etags = request.headers['if-none-match']?.split(',').map(clearTag);

  if (etags?.includes(etag)) {
    reply.code(304);
    return true;
  }

  return false;
};
