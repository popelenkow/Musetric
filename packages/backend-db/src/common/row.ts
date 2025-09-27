import type { SQLOutputValue } from 'node:sqlite';

export type Row = Record<string, SQLOutputValue>;
export type Buckets = Record<string, Row>;
export const bucketizeRow = (row: Row): Buckets => {
  const buckets: Buckets = {};

  Object.entries(row).forEach(([key, value]) => {
    const [entity, property] = key.split('_');
    buckets[entity] = buckets[entity] ?? {};
    buckets[entity][property] = value;
  });

  return buckets;
};
