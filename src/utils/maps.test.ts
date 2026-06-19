import { describe, expect, it } from 'vitest';
import { buildGoogleMapsSearchUrl } from './maps';

describe('maps utils', () => {
  it('builds a google maps search url near the user', () => {
    expect(buildGoogleMapsSearchUrl('miradores')).toContain(
      encodeURIComponent('miradores cerca de ti'),
    );
  });
});
