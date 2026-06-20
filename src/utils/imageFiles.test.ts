import { describe, expect, it } from 'vitest';
import { validateImageFile } from './imageFiles';

describe('validateImageFile', () => {
  it('accepts a JPEG with a matching binary signature', async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'photo.jpg', {
      type: 'image/jpeg',
    });

    await expect(validateImageFile(file)).resolves.toMatchObject({ ok: true });
  });

  it('rejects allowed MIME metadata when the content is not an image', async () => {
    const file = new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' });

    await expect(validateImageFile(file)).resolves.toEqual({
      ok: false,
      message: 'El archivo no contiene una imagen valida.',
    });
  });

  it('rejects formats outside the allowlist', async () => {
    const file = new File(['<svg/>'], 'vector.svg', { type: 'image/svg+xml' });

    await expect(validateImageFile(file)).resolves.toMatchObject({ ok: false });
  });
});

