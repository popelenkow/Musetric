import type { DatabaseSync } from 'node:sqlite';

export const transaction = <T>(
  database: DatabaseSync,
  operation: () => T,
): T => {
  if (database.isTransaction) {
    return operation();
  }
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
};
