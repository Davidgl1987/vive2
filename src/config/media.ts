export const mediaPolicy = {
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxInputBytes: 20 * 1024 * 1024,
  print: {
    maxBytes: 8 * 1024 * 1024,
    maxLongEdge: 3508,
    maxPixels: 12_000_000,
  },
  optimized: {
    mimeType: 'image/webp',
    maxLongEdge: 1600,
    quality: 0.8,
  },
} as const;

export type AcceptedImageMimeType = (typeof mediaPolicy.acceptedMimeTypes)[number];

