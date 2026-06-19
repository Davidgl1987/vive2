import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type ErrorBoundaryState = {
  error?: Error;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary caught an error', error, info);
  }

  render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-cream px-4">
        <Card className="max-w-md space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blush">
            Algo se ha torcido
          </p>
          <h1 className="text-2xl font-extrabold text-ink">La app necesita recargar esta pantalla</h1>
          <p className="text-sm leading-6 text-mist">
            Hemos evitado que el error rompa toda la experiencia. Recarga y seguimos desde el ultimo
            estado guardado.
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </Card>
      </main>
    );
  }
}
