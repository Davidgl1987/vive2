import type { LocalMedia, MediaVariantDescriptor, MediaVariantKind } from '../backend/domain';

export type SaveLocalMediaInput = MediaVariantDescriptor & {
  assetId: string;
  blob: Blob;
  verifiedAt?: string;
};

export interface LocalMediaStore {
  save(input: SaveLocalMediaInput): Promise<LocalMedia>;
  read(assetId: string, variant: MediaVariantKind): Promise<Blob>;
  remove(assetId: string): Promise<void>;
}

