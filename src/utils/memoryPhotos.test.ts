import { describe, expect, it } from 'vitest';
import type { CompletedPlan } from '../types/memory';
import { resolveMemoryPhotos } from './memoryPhotos';

const memory = (overrides: Partial<CompletedPlan> = {}): CompletedPlan => ({
  id: 'memory-1',
  coupleId: 'couple-1',
  planId: 'plan-1',
  planTitle: 'Plan',
  date: '2026-06-20',
  photos: [],
  note: '',
  rating: 5,
  sharedCount: 0,
  createdAt: '2026-06-20T10:00:00.000Z',
  updatedAt: '2026-06-20T10:00:00.000Z',
  ...overrides,
});

describe('resolveMemoryPhotos', () => {
  it('ignores stale legacy photos after partner photos have been removed', () => {
    expect(
      resolveMemoryPhotos(memory({ partnerPhotos: {}, photos: ['old-photo'] }), 'plan-cover'),
    ).toEqual(['plan-cover']);
  });

  it('keeps legacy photos readable for memories created before partner photos', () => {
    expect(resolveMemoryPhotos(memory({ photos: ['legacy-photo'] }), 'plan-cover')).toEqual([
      'legacy-photo',
    ]);
  });
});

