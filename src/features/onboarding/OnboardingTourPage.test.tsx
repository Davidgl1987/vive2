import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { plans } from '../../data/plans';
import { AuthPage } from './AuthPage';
import { OnboardingTourPage } from './OnboardingTourPage';

describe('OnboardingTourPage', () => {
  it('presents every main section before authentication', async () => {
    render(
      <MemoryRouter initialEntries={['/onboarding/tour']}>
        <Routes>
          <Route path="/onboarding/tour" element={<OnboardingTourPage />} />
          <Route path="/onboarding/auth" element={<AuthPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Todo lo vuestro, de un vistazo' })).toBeInTheDocument();
    expect(screen.getByText('4 / 10')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: plans[0].plan })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(await screen.findByRole('heading', { name: 'Una idea para cada momento' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar un plan')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    await screen.findByRole('heading', { name: 'Ponedle fecha entre los dos' });
    expect(screen.getByText('Cris propone')).toBeInTheDocument();
    expect(screen.getByText('David propone')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    await screen.findByRole('heading', { name: 'Convertid planes en historia' });
    expect(screen.getByRole('heading', { name: 'Reto actual' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(await screen.findByRole('heading', { name: 'Vuestra pareja, a vuestra manera' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Notificaciones' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /preparar mi cuenta/i }));
    expect(await screen.findByRole('heading', { name: 'Tu cuenta, antes de empezar' })).toBeInTheDocument();
  });
});
