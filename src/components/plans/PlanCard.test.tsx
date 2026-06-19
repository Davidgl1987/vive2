import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { CouplePlan } from '../../types/plan';
import { PlanCard } from './PlanCard';

const plan: CouplePlan = {
  id: 'plan_001',
  plan: 'Picnic bajo las estrellas',
  descripcion: 'Cena tranquila al aire libre',
  parteOriginal: 'Pregunta especial',
  presupuesto: 'bajo',
  costeEstimado: '10-25 EUR',
  ubicacion: 'exterior',
  categoria: ['romantico'],
  duracion: '2 horas',
  energia: 'tranquilo',
  necesitaReserva: false,
  idealPara: ['reconectar'],
  materiales: ['manta'],
  ayudaCercaDeTi: ['parques'],
  afiliadosSugeridos: [],
  preguntaRecuerdo: '¿Qué fue lo mejor?',
  textoCompartir: 'Texto',
  albumPrompt: 'Prompt',
  cover: 'https://example.com/picnic.jpg',
};

describe('PlanCard', () => {
  it('renders the plan data, status badges and route', () => {
    render(
      <MemoryRouter initialEntries={['/plans?budget=gratis&type=aventura']}>
        <PlanCard
          completed
          isNext
          locked
          plan={{ ...plan, isCustom: true }}
          statusBadge="En agenda"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Picnic bajo las estrellas')).toBeInTheDocument();
    expect(screen.getByText('Creado por vosotros')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Hecho')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/plans/plan_001?budget=gratis&type=aventura',
    );
    expect(screen.getByAltText('Picnic bajo las estrellas')).toHaveAttribute('src', plan.cover);
  });
});
