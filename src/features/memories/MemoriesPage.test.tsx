import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialAppStoreState } from '../../store/appStore.defaults';
import { useAppStore } from '../../store/useAppStore';
import { MemoriesPage } from './MemoriesPage';

describe('MemoriesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    const initialState = createInitialAppStoreState();
    const memory = initialState.memories[0];
    useAppStore.setState({
      ...initialState,
      activeChallenge: {
        ...initialState.activeChallenge,
        id: 'challenge_active',
        memoryIds: [],
        startedAt: '2026-07-01T12:00:00.000Z',
      },
      completedChallenges: [{
        id: 'challenge_completed',
        goal: 10,
        memoryIds: [memory.id],
        startedAt: '2026-06-01T12:00:00.000Z',
        completedAt: '2026-06-30T12:00:00.000Z',
      }],
    });
  });

  it('shows separate challenge sections and a scoped album link for each one', () => {
    render(
      <MemoryRouter>
        <MemoriesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Reto actual' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Retos completados' })).toBeInTheDocument();
    expect(screen.getByText('1 de junio de 2026 - 30 de junio de 2026')).toBeInTheDocument();

    const albumLinks = screen.getAllByRole('link', { name: 'Ver álbum / libro' });
    expect(albumLinks).toHaveLength(2);
    expect(albumLinks[0]).toHaveAttribute('href', '/album?challenge=challenge_active');
    expect(albumLinks[1]).toHaveAttribute('href', '/album?challenge=challenge_completed');
  });
});
