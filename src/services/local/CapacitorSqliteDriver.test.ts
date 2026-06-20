import { describe, expect, it, vi } from 'vitest';
import { CapacitorSqliteDriver, type CapacitorSqliteConnectionPort } from './CapacitorSqliteDriver';

describe('CapacitorSqliteDriver', () => {
  it('uses parameterized runs for statements with values', async () => {
    const connection: CapacitorSqliteConnectionPort = {
      execute: vi.fn().mockResolvedValue(undefined),
      run: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ values: [] }),
    };
    const driver = new CapacitorSqliteDriver(connection);

    await driver.execute('INSERT INTO sync_state(couple_id) VALUES (?)', ['couple-1']);

    expect(connection.run).toHaveBeenCalledWith(
      'INSERT INTO sync_state(couple_id) VALUES (?)',
      ['couple-1'],
      false,
    );
    expect(connection.execute).not.toHaveBeenCalled();
  });

  it('returns rows from the native connection', async () => {
    const connection: CapacitorSqliteConnectionPort = {
      execute: vi.fn().mockResolvedValue(undefined),
      run: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ values: [{ user_version: 1 }] }),
    };
    const driver = new CapacitorSqliteDriver(connection);

    await expect(driver.query('PRAGMA user_version')).resolves.toEqual([{ user_version: 1 }]);
  });
});

