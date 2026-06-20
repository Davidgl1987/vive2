import type { LocalMedia, MediaVariantKind } from '../backend/domain';
import type { LocalMediaStore, SaveLocalMediaInput } from './mediaStore.types';

type StoredMedia = { key: string; metadata: LocalMedia; blob: Blob };

const DATABASE_NAME = 'vive2-local-media';
const STORE_NAME = 'media';

const mediaKey = (assetId: string, variant: MediaVariantKind) => `${assetId}:${variant}`;

const requestResult = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export class WebLocalMediaStore implements LocalMediaStore {
  private database?: Promise<IDBDatabase>;

  async save(input: SaveLocalMediaInput) {
    const metadata: LocalMedia = {
      assetId: input.assetId,
      variant: input.variant,
      mimeType: input.mimeType,
      width: input.width,
      height: input.height,
      bytes: input.bytes,
      sha256: input.sha256,
      localUri: `indexeddb://${mediaKey(input.assetId, input.variant)}`,
      status: 'available',
      verifiedAt: input.verifiedAt,
    };
    const database = await this.openDatabase();
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({
      key: mediaKey(input.assetId, input.variant),
      metadata,
      blob: input.blob,
    } satisfies StoredMedia);
    await this.transactionDone(transaction);
    return metadata;
  }

  async read(assetId: string, variant: MediaVariantKind) {
    const database = await this.openDatabase();
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const stored = await requestResult<StoredMedia | undefined>(
      transaction.objectStore(STORE_NAME).get(mediaKey(assetId, variant)),
    );
    if (!stored) throw new Error('La variante local no existe.');
    return stored.blob;
  }

  async remove(assetId: string) {
    const database = await this.openDatabase();
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(mediaKey(assetId, 'print'));
    store.delete(mediaKey(assetId, 'optimized'));
    await this.transactionDone(transaction);
  }

  private openDatabase() {
    this.database ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.database;
  }

  private transactionDone(transaction: IDBTransaction) {
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
}

