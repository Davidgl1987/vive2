import type {
  AuthSession,
  ChangeBatch,
  CommandResult,
  DeviceRegistration,
  LocalMedia,
  MediaVariantKind,
  RegisterDeviceInput,
  RelayDownloadTarget,
  RelayReason,
  RelayUploadTarget,
  SyncCommand,
  UploadedVariant,
  VariantReceiptInput,
} from './domain';

export interface AuthService {
  signInWithGoogle(): Promise<AuthSession>;
  signInWithEmail(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
}

export interface BackendRepository {
  registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistration>;
  pullChanges(cursor?: string): Promise<ChangeBatch>;
  pushCommands(commands: SyncCommand[]): Promise<CommandResult[]>;
}

export interface ObjectRelayService {
  prepareUpload(assetId: string, reason: RelayReason): Promise<RelayUploadTarget>;
  completeUpload(sessionId: string, variants: UploadedVariant[]): Promise<void>;
  getDownloadTargets(sessionId: string): Promise<RelayDownloadTarget[]>;
  acknowledgeVariant(input: VariantReceiptInput): Promise<void>;
}

export interface LocalMediaStore {
  save(assetId: string, variant: MediaVariantKind, bytes: Blob): Promise<LocalMedia>;
  read(assetId: string, variant: MediaVariantKind): Promise<Blob>;
  remove(assetId: string): Promise<void>;
}

