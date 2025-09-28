import type { DatabaseSync } from 'node:sqlite';

export const remove = (database: DatabaseSync) => {
  const statement = database.prepare(`DELETE FROM Project WHERE id = ?`);

  return (projectId: number): boolean => {
    const result = statement.run(projectId);
    return result.changes !== 0;
  };
};
