import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialAppStoreState } from '../../store/appStore.defaults';
import { useAppStore } from '../../store/useAppStore';
import { PlanDetailPage } from './PlanDetailPage';

const renderPage = (path = '/plans/plan_001') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/plans/:planId" element={<PlanDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('PlanDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState(createInitialAppStoreState());
  });

  it('builds chip searches near the user', () => {
    renderPage();

    const chip = screen.getByRole('link', { name: 'miradores' });
    expect(chip).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent('miradores cerca de ti')),
    );
    expect(screen.getByText('Ahora buscaremos cerca de ti.')).toBeInTheDocument();
  });

  it('preserves the catalog filters in its back link', () => {
    const { container } = renderPage('/plans/plan_001?budget=gratis&location=exterior');

    expect(container.querySelector('a[href^="/plans?"]')).toHaveAttribute(
      'href',
      '/plans?budget=gratis&location=exterior',
    );
  });

  it('adds the selected calendar date when proposing a plan', () => {
    renderPage('/plans/plan_002?date=2026-07-15');

    fireEvent.click(screen.getByRole('button', { name: 'Proponer para este día' }));

    const agendaItem = useAppStore.getState().agendaItems.find((item) => item.planId === 'plan_002');
    expect(agendaItem?.date).toBe('2026-07-15');
  });
});
