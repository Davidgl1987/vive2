import { describe, expect, it } from 'vitest';
import { formatDateKeyWeekdayLabel } from './format';

describe('date formatting', () => {
  it('formats Spanish weekdays as three lowercase letters without accents', () => {
    expect(formatDateKeyWeekdayLabel('2026-06-17')).toBe('mie');
    expect(formatDateKeyWeekdayLabel('2026-06-20')).toBe('sab');
    expect(formatDateKeyWeekdayLabel('2026-06-21')).toBe('dom');
  });
});
