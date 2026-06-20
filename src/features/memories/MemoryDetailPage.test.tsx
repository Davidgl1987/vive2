import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialAppStoreState } from '../../store/appStore.defaults';
import { useAppStore } from '../../store/useAppStore';
import type { CompletedPlan } from '../../types/memory';
import { findPlanById } from '../../utils/plans';
import { MemoryDetailPage } from './MemoryDetailPage';

const memoryId = 'memory_detail_test';

describe('MemoryDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    const initialState = createInitialAppStoreState();
    const memory: CompletedPlan = {
      id: memoryId,
      coupleId: initialState.coupleId,
      planId: 'plan_001',
      planTitle: 'Picnic bajo las estrellas',
      date: '2026-06-17T18:00:00.000Z',
      photos: [],
      note: 'Un recuerdo de prueba',
      rating: 5,
      sharedCount: 0,
      createdAt: '2026-06-17T18:00:00.000Z',
      updatedAt: '2026-06-17T18:00:00.000Z',
    };
    useAppStore.setState({
      ...initialState,
      memories: [memory],
      activeChallenge: {
        ...initialState.activeChallenge,
        memoryIds: [memory.id],
        startedAt: memory.createdAt,
      },
    });
  });

  it('updates a partner photo without counting the memory again', async () => {
    const initialProgress = useAppStore.getState().activeChallenge.memoryIds.length;

    render(
      <MemoryRouter initialEntries={[`/memories/${memoryId}`]}>
        <Routes>
          <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const photo = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'cris.png',
      { type: 'image/png' },
    );
    const otherPartnerPhoto = useAppStore.getState().memories.find(
      (item) => item.id === memoryId,
    )?.partnerPhotos?.partner_two;

    fireEvent.change(screen.getByLabelText('Subir mi foto del plan'), {
      target: { files: [photo] },
    });

    await waitFor(() => {
      const memory = useAppStore.getState().memories.find((item) => item.id === memoryId);
      expect(memory?.partnerPhotos?.partner_one).toMatch(/^data:image\/png;base64,/);
    });

    expect(useAppStore.getState().activeChallenge.memoryIds).toHaveLength(initialProgress);
    expect(
      useAppStore.getState().memories.find((item) => item.id === memoryId)?.partnerPhotos
        ?.partner_two,
    ).toBe(otherPartnerPhoto);
    expect(screen.getByText('Foto actualizada')).toBeInTheDocument();
  });

  it('removes the current partner photo and falls back to the plan cover', async () => {
    const state = useAppStore.getState();
    const memory = state.memories.find((item) => item.id === memoryId)!;
    const ownPhoto = 'data:image/png;base64,own-photo';
    const planCover = findPlanById(state.customPlans, memory.planId)?.cover;

    useAppStore.setState({
      memories: state.memories.map((item) =>
        item.id === memoryId
          ? {
              ...item,
              partnerPhotos: { partner_one: ownPhoto },
              photos: [ownPhoto],
            }
          : item,
      ),
    });

    render(
      <MemoryRouter initialEntries={[`/memories/${memoryId}`]}>
        <Routes>
          <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Quitar mi foto' }));

    await waitFor(() => {
      const updatedMemory = useAppStore.getState().memories.find((item) => item.id === memoryId);
      expect(updatedMemory?.partnerPhotos?.partner_one).toBeUndefined();
      expect(updatedMemory?.photos).not.toContain(ownPhoto);
    });

    expect(screen.getByAltText(memory.planTitle)).toHaveAttribute('src', planCover);
    expect(screen.getByText('Foto eliminada')).toBeInTheDocument();
    expect(screen.getByLabelText('Subir mi foto del plan')).toBeInTheDocument();
  });

  it('does not restore the previous photo after changing and removing it', async () => {
    const state = useAppStore.getState();
    const originalPhoto = 'data:image/png;base64,original-photo';
    useAppStore.setState({
      memories: state.memories.map((item) =>
        item.id === memoryId
          ? { ...item, partnerPhotos: { partner_one: originalPhoto }, photos: [originalPhoto] }
          : item,
      ),
    });
    const planCover = findPlanById(state.customPlans, 'plan_001')?.cover;
    render(
      <MemoryRouter initialEntries={[`/memories/${memoryId}`]}>
        <Routes>
          <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Cambiar mi foto'), {
      target: {
        files: [
          new File(
            [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
            'replacement.png',
            { type: 'image/png' },
          ),
        ],
      },
    });
    await waitFor(() => {
      const updated = useAppStore.getState().memories.find((item) => item.id === memoryId)!;
      expect(updated.partnerPhotos?.partner_one).not.toBe(originalPhoto);
      expect(updated.photos).not.toContain(originalPhoto);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Quitar mi foto' }));

    await waitFor(() => {
      const updated = useAppStore.getState().memories.find((item) => item.id === memoryId)!;
      expect(updated.partnerPhotos).toEqual({});
      expect(updated.photos).toEqual([]);
    });
    expect(screen.getByAltText('Picnic bajo las estrellas')).toHaveAttribute('src', planCover);
  });
});
