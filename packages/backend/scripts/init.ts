import { DB } from '@musetric/backend-db';
import { createTables } from '@musetric/backend-db/migrations';
import { downloadModel } from '@musetric/backend-workers/scripts';
import { envs } from '../src/common/envs.js';

const initDB = () => {
  const database = DB.createDatabase(envs.databasePath);
  try {
    createTables(database);
    console.log('Database schema initialized');
  } finally {
    if (database.isOpen) {
      database.close();
    }
  }
};

const init = async () => {
  initDB();

  await downloadModel({
    modelPath: envs.modelPath,
    modelConfigPath: envs.modelConfigPath,
  });
};

await init();
