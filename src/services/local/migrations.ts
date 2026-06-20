import type { SqliteDriver } from './database';

export type LocalMigration = {
  version: number;
  statements: string[];
};

export const localMigrations: LocalMigration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS local_media (
        asset_id TEXT NOT NULL,
        variant TEXT NOT NULL CHECK (variant IN ('print', 'optimized')),
        local_uri TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        bytes INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        status TEXT NOT NULL,
        verified_at TEXT,
        PRIMARY KEY (asset_id, variant)
      )`,
      `CREATE TABLE IF NOT EXISTS sync_outbox (
        command_id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        next_retry_at TEXT,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sync_state (
        couple_id TEXT PRIMARY KEY,
        cursor TEXT,
        last_successful_sync_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS device_state (
        device_id TEXT PRIMARY KEY,
        installation_id TEXT NOT NULL UNIQUE,
        registered_at TEXT NOT NULL
      )`,
      'CREATE INDEX IF NOT EXISTS idx_sync_outbox_retry ON sync_outbox(next_retry_at, created_at)',
      'CREATE INDEX IF NOT EXISTS idx_local_media_status ON local_media(status)',
    ],
  },
];

export const applyLocalMigrations = async (
  driver: SqliteDriver,
  currentVersion: number,
  migrations: LocalMigration[] = localMigrations,
) => {
  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((left, right) => left.version - right.version);

  for (const migration of pending) {
    await driver.execute('BEGIN');
    try {
      for (const statement of migration.statements) await driver.execute(statement);
      await driver.execute(`PRAGMA user_version = ${migration.version}`);
      await driver.execute('COMMIT');
    } catch (error) {
      await driver.execute('ROLLBACK');
      throw error;
    }
  }

  return pending.at(-1)?.version ?? currentVersion;
};

