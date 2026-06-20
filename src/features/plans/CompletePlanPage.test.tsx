import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialAppStoreState } from '../../store/appStore.defaults';
import { useAppStore } from '../../store/useAppStore';
import { findPlanById } from '../../utils/plans';
import { CompletePlanPage } from './CompletePlanPage';

describe('CompletePlanPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState(createInitialAppStoreState());
  });

  it('shows the plan cover and restores it after removing the selected photo', async () => {
    const state = useAppStore.getState();
    const plan = findPlanById(state.customPlans, 'plan_001')!;
    render(
      <MemoryRouter initialEntries={['/plans/plan_001/complete']}>
        <Routes>
          <Route path="/plans/:planId/complete" element={<CompletePlanPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByAltText(`Portada de ${plan.plan}`)).toHaveAttribute('src', plan.cover);

    fireEvent.change(screen.getByLabelText('Subir mi foto del plan'), {
      target: {
        files: [
          new File(
            [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
            'photo.png',
            { type: 'image/png' },
          ),
        ],
      },
    });

    await screen.findByAltText(`Foto para ${plan.plan}`);
    expect(screen.getByLabelText('Cambiar mi foto')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar mi foto' }));

    await waitFor(() => {
      expect(screen.getByAltText(`Portada de ${plan.plan}`)).toHaveAttribute('src', plan.cover);
    });
    expect(screen.getByLabelText('Subir mi foto del plan')).toBeInTheDocument();
  });
});

