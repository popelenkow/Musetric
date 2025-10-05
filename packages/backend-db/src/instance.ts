import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { blob, separation, preview, project, sound } from './entity/index.js';

export const createDatabase = (databasePath: string): DatabaseSync => {
  mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath, {
    enableForeignKeyConstraints: true,
    timeout: 5000,
  });
  database.exec('PRAGMA foreign_keys = ON;');
  database.exec('PRAGMA journal_mode = WAL;');
  return database;
};

export const createInstance = (databasePath: string) => {
  const database = createDatabase(databasePath);

  return {
    project: project.createInstance(database),
    preview: preview.createInstance(database),
    sound: sound.createInstance(database),
    separation: separation.createInstance(database),
    blob: blob.createInstance(database),
    disconnect: () => {
      if (database.isOpen) {
        database.close();
      }
    },
  };
};
export type Instance = ReturnType<typeof createInstance>;
