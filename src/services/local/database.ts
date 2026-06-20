export type SqlValue = string | number | null;
export type SqlRow = Record<string, SqlValue>;

export interface SqliteDriver {
  execute(sql: string, values?: SqlValue[]): Promise<void>;
  query<T extends SqlRow = SqlRow>(sql: string, values?: SqlValue[]): Promise<T[]>;
}

export interface LocalDatabase extends SqliteDriver {
  initialize(): Promise<void>;
  getSchemaVersion(): Promise<number>;
}

