import type { SqliteDriver, SqlRow, SqlValue } from './database';

export interface CapacitorSqliteConnectionPort {
  execute(statements: string, transaction?: boolean): Promise<unknown>;
  run(statement: string, values?: SqlValue[], transaction?: boolean): Promise<unknown>;
  query(statement: string, values?: SqlValue[]): Promise<{ values?: SqlRow[] }>;
}

export class CapacitorSqliteDriver implements SqliteDriver {
  constructor(private readonly connection: CapacitorSqliteConnectionPort) {}

  async execute(sql: string, values?: SqlValue[]) {
    if (values?.length) {
      await this.connection.run(sql, values, false);
      return;
    }
    await this.connection.execute(sql, false);
  }

  async query<T extends SqlRow = SqlRow>(sql: string, values?: SqlValue[]) {
    const result = await this.connection.query(sql, values);
    return (result.values ?? []) as T[];
  }
}

