import { createId } from '../../utils/id';
import type { BackendRepository } from './contracts';
import type {
  Change,
  ChangeBatch,
  CommandResult,
  DeviceRegistration,
  RegisterDeviceInput,
  SyncCommand,
  VersionedEntity,
} from './domain';

const parseCursor = (cursor?: string) => {
  const value = Number(cursor ?? 0);
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
};

export class FakeBackendRepository implements BackendRepository {
  private readonly changes: Change[] = [];
  private readonly commandResults = new Map<string, CommandResult>();
  private readonly devicesByUser = new Map<string, DeviceRegistration>();
  private readonly entities = new Map<string, VersionedEntity>();

  constructor(private readonly now: () => Date = () => new Date()) {}

  async registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistration> {
    const activeDevice = this.devicesByUser.get(input.userId);
    if (activeDevice?.installationId === input.installationId) return activeDevice;

    const registration: DeviceRegistration = {
      deviceId: createId(),
      userId: input.userId,
      installationId: input.installationId,
      platform: input.platform,
      registeredAt: this.now().toISOString(),
      replacedDeviceId: activeDevice?.deviceId,
    };
    this.devicesByUser.set(input.userId, registration);
    return registration;
  }

  async pullChanges(cursor?: string): Promise<ChangeBatch> {
    const sequence = parseCursor(cursor);
    const changes = this.changes.filter((change) => change.sequence > sequence);
    return {
      changes,
      cursor: String(changes.at(-1)?.sequence ?? sequence),
      hasMore: false,
    };
  }

  async pushCommands(commands: SyncCommand[]): Promise<CommandResult[]> {
    return commands.map((command) => this.applyCommand(command));
  }

  private applyCommand(command: SyncCommand): CommandResult {
    const previousResult = this.commandResults.get(command.idempotencyKey);
    if (previousResult) {
      return previousResult.status === 'applied'
        ? { ...previousResult, status: 'duplicate' }
        : previousResult;
    }

    const currentEntity = this.entities.get(command.entity.id);
    if (
      command.expectedVersion !== undefined &&
      (currentEntity?.version ?? 0) !== command.expectedVersion
    ) {
      const conflict: CommandResult = {
        idempotencyKey: command.idempotencyKey,
        status: 'conflict',
        currentEntity,
        message: 'La version remota ha cambiado.',
      };
      this.commandResults.set(command.idempotencyKey, conflict);
      return conflict;
    }

    const timestamp = this.now().toISOString();
    const entity: VersionedEntity = {
      ...command.entity,
      createdAt: currentEntity?.createdAt ?? command.entity.createdAt ?? timestamp,
      updatedAt: timestamp,
      version: (currentEntity?.version ?? 0) + 1,
      deletedAt: command.operation === 'delete' ? timestamp : undefined,
    };
    this.entities.set(entity.id, entity);
    this.changes.push({
      sequence: this.changes.length + 1,
      operation: command.operation,
      entity,
    });

    const result: CommandResult = {
      idempotencyKey: command.idempotencyKey,
      status: 'applied',
      entity,
    };
    this.commandResults.set(command.idempotencyKey, result);
    return result;
  }
}

