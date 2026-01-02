import type { DatabaseSync } from 'node:sqlite';

const createProject = `
  CREATE TABLE IF NOT EXISTS Project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('pending', 'done'))
  );
`;

const createSound = `
  CREATE TABLE IF NOT EXISTS Sound (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('original', 'vocal', 'instrumental')),
    blobId TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    contentType TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
  );
`;

const createSoundIndex = `
  CREATE INDEX IF NOT EXISTS Sound_projectId_type_index ON Sound (projectId, type);
`;

const createPreview = `
  CREATE TABLE IF NOT EXISTS Preview (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL UNIQUE,
    blobId TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    contentType TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
  );
`;

const createSubtitle = `
  CREATE TABLE IF NOT EXISTS Subtitle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL UNIQUE,
    blobId TEXT NOT NULL UNIQUE,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
  );
`;

const creationStatements = [
  createProject,
  createSound,
  createSoundIndex,
  createPreview,
  createSubtitle,
] as const;

export const createTables = (database: DatabaseSync) => {
  creationStatements.forEach((statement) => {
    database.exec(statement);
  });
};
