import type { PartnerId } from './plan';

export type CompletedPlan = {
  id: string;
  coupleId: string;
  planId: string;
  planTitle: string;
  date: string;
  locationName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
  partnerPhotos?: Partial<Record<PartnerId, string>>;
  photos: string[];
  note: string;
  rating: 1 | 2 | 3 | 4 | 5;
  sharedCount: number;
  addToAlbum?: boolean;
  createdAt: string;
  updatedAt: string;
};
