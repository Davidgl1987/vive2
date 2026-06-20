import { describe, expect, it, vi } from 'vitest';
import type { SqliteDriver } from './database';
import { applyLocalMigrations, type LocalMigration } from './migrations';

describe('applyLocalMigrations', () => {
  it('applies only pending migrations in a transaction', async () => {
    const driver: SqliteDriver = {
      execute: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue([]),
    };
    const migrations: LocalMigration[] = [
      { version: 1, statements: ['FIRST'] },
      { version: 2, statements: ['SECOND'] },
    ];

    await expect(applyLocalMigrations(driver, 1, migrations)).resolves.toBe(2);
    expect(driver.execute).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(driver.execute).toHaveBeenNthCalledWith(2, 'SECOND');
    expect(driver.execute).toHaveBeenNthCalledWith(3, 'PRAGMA user_version = 2');
    expect(driver.execute).toHaveBeenNthCalledWith(4, 'COMMIT');
  });

  it('rolls back a failed migration', async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('migration failed'))
      .mockResolvedValueOnce(undefined);
    const driver: SqliteDriver = { execute, query: vi.fn().mockResolvedValue([]) };

    await expect(
      applyLocalMigrations(driver, 0, [{ version: 1, statements: ['BROKEN'] }]),
    ).rejects.toThrow('migration failed');
    expect(execute).toHaveBeenLastCalledWith('ROLLBACK');
  });
});

