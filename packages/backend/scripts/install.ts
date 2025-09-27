import { DB } from '@musetric/backend-db';
import { createTables } from '@musetric/backend-db/schema';
import { envs } from '../src/common/envs';

const isCheckMode = process.env.workspace_mode === 'check';

if (isCheckMode) {
  console.log('Database initialization skipped');
  process.exit(0);
}

const database = DB.createDatabase(envs.databasePath);
try {
  createTables(database);
  console.log('Database schema initialized');
} finally {
  if (database.isOpen) {
    database.close();
  }
}
