import { describe, expect, it } from 'vitest';
import { FakeBackendRepository } from './FakeBackendRepository';
import type { SyncCommand, VersionedEntity } from './domain';

const entity: VersionedEntity = {
  id: 'memory-1',
  entityType: 'memory',
  coupleId: 'couple-1',
  createdAt: '2026-06-20T10:00:00.000Z',
  updatedAt: '2026-06-20T10:00:00.000Z',
  version: 0,
  data: { title: 'Picnic' },
};

const command = (overrides: Partial<SyncCommand> = {}): SyncCommand => ({
  idempotencyKey: 'command-1',
  operation: 'upsert',
  entity,
  expectedVersion: 0,
  ...overrides,
});

describe('FakeBackendRepository', () => {
  it('applies idempotent commands and exposes them through the cursor', async () => {
    const repository = new FakeBackendRepository(() => new Date('2026-06-20T12:00:00.000Z'));

    const [applied] = await repository.pushCommands([command()]);
    const [duplicate] = await repository.pushCommands([command()]);
    const batch = await repository.pullChanges();

    expect(applied.status).toBe('applied');
    expect(duplicate.status).toBe('duplicate');
    expect(batch.changes).toHaveLength(1);
    expect(batch.cursor).toBe('1');
    expect((applied.status === 'applied' && applied.entity.version) || 0).toBe(1);
  });

  it('rejects an optimistic update with an outdated version', async () => {
    const repository = new FakeBackendRepository();
    await repository.pushCommands([command()]);

    const [result] = await repository.pushCommands([
      command({ idempotencyKey: 'command-2', expectedVersion: 0 }),
    ]);

    expect(result.status).toBe('conflict');
    expect(result.status === 'conflict' && result.currentEntity?.version).toBe(1);
  });

  it('replaces the active device for a user', async () => {
    const repository = new FakeBackendRepository();
    const first = await repository.registerDevice({
      userId: 'user-1',
      installationId: 'install-1',
      platform: 'ios',
    });
    const second = await repository.registerDevice({
      userId: 'user-1',
      installationId: 'install-2',
      platform: 'android',
    });

    expect(second.replacedDeviceId).toBe(first.deviceId);
  });
});

