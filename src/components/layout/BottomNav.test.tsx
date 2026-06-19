import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('renders the main sections and marks the current route as active', () => {
    render(
      <MemoryRouter initialEntries={['/agenda']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Planes')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
    expect(screen.getByText('Momentos')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agenda/i })).toHaveAttribute('aria-current', 'page');
  });
});
