import { mediaPolicy, type AcceptedImageMimeType } from '../config/media';

export type ImageFileValidation =
  | { ok: true; mimeType: AcceptedImageMimeType }
  | { ok: false; message: string };

const hasImageSignature = async (file: File, mimeType: AcceptedImageMimeType) => {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (mimeType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === 'image/png') {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes[index] === byte,
    );
  }

  return (
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  );
};

export const validateImageFile = async (file: File): Promise<ImageFileValidation> => {
  if (!mediaPolicy.acceptedMimeTypes.some((mimeType) => mimeType === file.type)) {
    return { ok: false, message: 'Elige una imagen JPEG, PNG o WebP.' };
  }

  if (file.size > mediaPolicy.maxInputBytes) {
    return { ok: false, message: 'La imagen no puede superar 20 MB.' };
  }

  const mimeType = file.type as AcceptedImageMimeType;
  if (!(await hasImageSignature(file, mimeType))) {
    return { ok: false, message: 'El archivo no contiene una imagen valida.' };
  }

  return { ok: true, mimeType };
};

