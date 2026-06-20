import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { CapacitorFilesystemMediaStore, type FilesystemPort } from './CapacitorFilesystemMediaStore';
import { CapacitorSqliteDriver } from './CapacitorSqliteDriver';
import { SqliteLocalDatabase } from './SqliteLocalDatabase';

const DATABASE_NAME = 'vive2';

const filesystemPort: FilesystemPort = {
  writeFile: (input) => Filesystem.writeFile({ ...input, directory: Directory.Data }),
  readFile: (input) => Filesystem.readFile({ ...input, directory: Directory.Data }),
  deleteFile: (input) => Filesystem.deleteFile({ ...input, directory: Directory.Data }),
};

const getConnection = async (sqlite: SQLiteConnection): Promise<SQLiteDBConnection> => {
  const consistency = await sqlite.checkConnectionsConsistency();
  const existing = await sqlite.isConnection(DATABASE_NAME, false);
  if (consistency.result && existing.result) {
    return sqlite.retrieveConnection(DATABASE_NAME, false);
  }
  return sqlite.createConnection(DATABASE_NAME, false, 'no-encryption', 1, false);
};

export const createNativeLocalServices = async () => {
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const connection = await getConnection(sqlite);
  if (!(await connection.isDBOpen()).result) await connection.open();

  const database = new SqliteLocalDatabase(new CapacitorSqliteDriver(connection));
  await database.initialize();

  return {
    database,
    mediaStore: new CapacitorFilesystemMediaStore(filesystemPort),
    close: () => sqlite.closeConnection(DATABASE_NAME, false),
  };
};

