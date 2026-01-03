import { DB } from '@musetric/backend-db';
import { createTables } from '@musetric/backend-db/migrations';
import { envs } from '../src/common/envs.js';

const initDB = async () => {
  const database = await DB.createDatabase(envs.databasePath);
  try {
    await createTables(database);
    console.log('Database schema initialized');
  } finally {
    if (database.isOpen) {
      database.close();
    }
  }
};

await initDB();
