import type { LocalMedia, MediaVariantKind } from '../backend/domain';
import type { LocalMediaStore, SaveLocalMediaInput } from './mediaStore.types';

export interface FilesystemPort {
  writeFile(input: { path: string; data: string; recursive: boolean }): Promise<{ uri: string }>;
  readFile(input: { path: string }): Promise<{ data: string | Blob }>;
  deleteFile(input: { path: string }): Promise<void>;
}

const mediaPath = (assetId: string, variant: MediaVariantKind) =>
  `media/${encodeURIComponent(assetId)}/${variant}`;

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const base64ToBlob = (data: string, mimeType = 'application/octet-stream') => {
  const binary = atob(data);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
};

export class CapacitorFilesystemMediaStore implements LocalMediaStore {
  constructor(private readonly filesystem: FilesystemPort) {}

  async save(input: SaveLocalMediaInput) {
    const path = mediaPath(input.assetId, input.variant);
    const result = await this.filesystem.writeFile({
      path,
      data: await blobToBase64(input.blob),
      recursive: true,
    });
    return {
      assetId: input.assetId,
      variant: input.variant,
      mimeType: input.mimeType,
      width: input.width,
      height: input.height,
      bytes: input.bytes,
      sha256: input.sha256,
      localUri: result.uri,
      status: 'available',
      verifiedAt: input.verifiedAt,
    } satisfies LocalMedia;
  }

  async read(assetId: string, variant: MediaVariantKind) {
    const result = await this.filesystem.readFile({ path: mediaPath(assetId, variant) });
    return result.data instanceof Blob ? result.data : base64ToBlob(result.data);
  }

  async remove(assetId: string) {
    await Promise.allSettled([
      this.filesystem.deleteFile({ path: mediaPath(assetId, 'print') }),
      this.filesystem.deleteFile({ path: mediaPath(assetId, 'optimized') }),
    ]);
  }
}

