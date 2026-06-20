export type EntityId = string;
export type IsoDateTime = string;

export type SyncEntityType =
  | 'user_profile'
  | 'device'
  | 'couple'
  | 'couple_member'
  | 'invitation'
  | 'custom_plan'
  | 'agenda_item'
  | 'agenda_member_state'
  | 'challenge'
  | 'memory'
  | 'media_asset';

export type SyncOperation = 'upsert' | 'delete';

export type VersionedEntity<T extends SyncEntityType = SyncEntityType> = {
  id: EntityId;
  entityType: T;
  coupleId?: EntityId;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  version: number;
  deletedAt?: IsoDateTime;
  data: Record<string, unknown>;
};

export type DevicePlatform = 'ios' | 'android' | 'web';

export type RegisterDeviceInput = {
  userId: EntityId;
  installationId: string;
  platform: DevicePlatform;
  pushToken?: string;
};

export type DeviceRegistration = {
  deviceId: EntityId;
  userId: EntityId;
  installationId: string;
  platform: DevicePlatform;
  registeredAt: IsoDateTime;
  replacedDeviceId?: EntityId;
};

export type SyncCommand = {
  idempotencyKey: string;
  operation: SyncOperation;
  entity: VersionedEntity;
  expectedVersion?: number;
};

export type CommandResult =
  | { idempotencyKey: string; status: 'applied'; entity: VersionedEntity }
  | { idempotencyKey: string; status: 'duplicate'; entity: VersionedEntity }
  | {
      idempotencyKey: string;
      status: 'conflict';
      currentEntity?: VersionedEntity;
      message: string;
    };

export type Change = {
  sequence: number;
  operation: SyncOperation;
  entity: VersionedEntity;
};

export type ChangeBatch = {
  changes: Change[];
  cursor: string;
  hasMore: boolean;
};

export type MediaVariantKind = 'print' | 'optimized';
export type RelayReason = 'initial_delivery' | 'device_recovery';

export type MediaVariantDescriptor = {
  variant: MediaVariantKind;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
  bytes: number;
  sha256: string;
};

export type RelayUploadTarget = {
  sessionId: EntityId;
  assetId: EntityId;
  expiresAt: IsoDateTime;
  targets: Array<{ variant: MediaVariantKind; url: string }>;
};

export type UploadedVariant = MediaVariantDescriptor & { objectKey: string };
export type RelayDownloadTarget = MediaVariantDescriptor & { url: string };

export type VariantReceiptInput = {
  assetId: EntityId;
  deviceId: EntityId;
  variant: MediaVariantKind;
  sha256: string;
};

export type AuthSession = {
  accessToken: string;
  userId: EntityId;
  expiresAt: IsoDateTime;
};

export type LocalMedia = MediaVariantDescriptor & {
  assetId: EntityId;
  localUri: string;
  status: 'available' | 'missing' | 'failed';
  verifiedAt?: IsoDateTime;
};

