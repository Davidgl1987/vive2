import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OwnPlanPhotoButton } from './OwnPlanPhotoButton';

describe('OwnPlanPhotoButton', () => {
  it('clears a file error when the current photo is removed', async () => {
    const onRemovePhoto = vi.fn();
    render(
      <OwnPlanPhotoButton
        hasPhoto
        onRemovePhoto={onRemovePhoto}
        onSelectPhoto={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Cambiar mi foto'), {
      target: {
        files: [new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' })],
      },
    });
    await screen.findByRole('alert');

    fireEvent.click(screen.getByRole('button', { name: 'Quitar mi foto' }));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(onRemovePhoto).toHaveBeenCalledOnce();
  });

  it('clears the previous error when a new file selection starts', async () => {
    render(<OwnPlanPhotoButton hasPhoto={false} onSelectPhoto={vi.fn()} />);
    const input = screen.getByLabelText('Subir mi foto del plan');

    fireEvent.change(input, {
      target: {
        files: [new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' })],
      },
    });
    await screen.findByRole('alert');

    fireEvent.click(input);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
