import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthPage } from './AuthPage';
import { JoinByCodePage } from './JoinByCodePage';

const renderAuthFlow = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/onboarding/auth" element={<AuthPage />} />
        <Route path="/onboarding/join" element={<JoinByCodePage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('onboarding authentication flow', () => {
  it('does not show the invitation code before authentication', () => {
    renderAuthFlow('/onboarding/join?code=VIVE2-ABC123');

    expect(screen.getByRole('heading', { name: 'Tu cuenta, antes de empezar' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Código de invitación')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continuar con Google' }));

    expect(screen.getByLabelText('Código de invitación')).toHaveValue('VIVE2-ABC123');
  });

  it('offers creating a space or joining one after authentication', () => {
    renderAuthFlow('/onboarding/auth');

    fireEvent.click(screen.getByRole('button', { name: 'Continuar con Google' }));

    expect(screen.getByRole('button', { name: 'Crear nuestro espacio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tengo un código' })).toBeInTheDocument();
  });
});
