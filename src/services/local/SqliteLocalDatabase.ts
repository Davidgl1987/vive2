import type { LocalDatabase, SqliteDriver, SqlRow, SqlValue } from './database';
import { applyLocalMigrations } from './migrations';

type UserVersionRow = SqlRow & { user_version: number };

export class SqliteLocalDatabase implements LocalDatabase {
  constructor(private readonly driver: SqliteDriver) {}

  async initialize() {
    await applyLocalMigrations(this.driver, await this.getSchemaVersion());
  }

  async getSchemaVersion() {
    const [row] = await this.driver.query<UserVersionRow>('PRAGMA user_version');
    return Number(row?.user_version ?? 0);
  }

  execute(sql: string, values?: SqlValue[]) {
    return this.driver.execute(sql, values);
  }

  query<T extends SqlRow = SqlRow>(sql: string, values?: SqlValue[]) {
    return this.driver.query<T>(sql, values);
  }
}

