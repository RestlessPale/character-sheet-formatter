import { describe, expect, it } from 'vitest';
import { buildSheet } from '../src/lib/sheet';
import { GOLDEN_SHEET, completeValues, toLegacy } from './fixtures';
import { legacyBuildSheet } from './legacy-reference';

describe('buildSheet', () => {
  it('matches the text the original site copied', () => {
    expect(buildSheet(completeValues())).toBe(GOLDEN_SHEET);
  });

  it.each([
    ['without a sexuality preference', { sexualityPreference: '' }],
    ['without a timezone', { timeZone: '' }],
    ['without notes and maybe-kinks', { notes: '', kinksMaybe: '' }],
    ['with multi-line and special characters', { backstory: 'Line one\nLine **two** ✔️' }],
  ])('is identical to the legacy implementation %s', (_label, override) => {
    const values = { ...completeValues(), ...override };
    expect(buildSheet(values)).toBe(legacyBuildSheet(toLegacy(values)));
  });
});
