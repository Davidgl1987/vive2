import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialAppStoreState } from '../../store/appStore.defaults';
import { useAppStore } from '../../store/useAppStore';
import { MemoryDetailPage } from './MemoryDetailPage';

describe('MemoryDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState(createInitialAppStoreState());
  });

  it('updates a partner photo without counting the memory again', async () => {
    const memoryId = useAppStore.getState().activeChallenge.memoryIds[0];
    const initialProgress = useAppStore.getState().activeChallenge.memoryIds.length;

    render(
      <MemoryRouter initialEntries={[`/memories/${memoryId}`]}>
        <Routes>
          <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const photo = new File(['photo'], 'cris.png', { type: 'image/png' });
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
});
