import { describe, expect, it } from 'vitest';
import { fields, type NumberField, type TextField } from '../src/lib/fields';
import {
  clampAge,
  containsAnyTerm,
  formatError,
  isAgeTooLow,
  isFieldValid,
  sanitizeName,
} from '../src/lib/validation';
import { completeValues } from './fixtures';
import { legacyIncludesTerm, legacyValidateAge, legacyValidateTextOnly } from './legacy-reference';

const age = fields.age as NumberField;
const backstory = fields.backstory as TextField;

describe('sanitizeName', () => {
  it.each(['Konan', 'Konan 123!', 'Ma-rie_O’Neil', '  ', '', 'ÄÖ ü', 'a\tb\nc'])(
    'behaves like the legacy filter for %j',
    (input) => {
      expect(sanitizeName(input)).toBe(legacyValidateTextOnly(input));
    },
  );
});

describe('clampAge', () => {
  it.each([null, 0, 12, 17, 18, 30, 69, 70, 1000, -5])(
    'behaves like the legacy clamp for %s',
    (input) => {
      expect(clampAge(input, age)).toBe(legacyValidateAge(input === null ? '' : input));
    },
  );

  it('falls back to the minimum for NaN', () => {
    expect(clampAge(Number.NaN, age)).toBe(18);
  });
});

describe('isAgeTooLow', () => {
  it('treats empty and below-minimum ages as too low', () => {
    expect(isAgeTooLow(null, age)).toBe(true);
    expect(isAgeTooLow(17, age)).toBe(true);
    expect(isAgeTooLow(18, age)).toBe(false);
  });
});

describe('term detection', () => {
  const [sorcery, nord] = backstory.termAlerts!;

  it.each([
    'A witch lived here',
    'MAGIC is real',
    'a Sorcerer',
    'mage',
    'no such words',
    'Nord, and more',
    'the Nords. Many',
    'a nord',
    'Nord',
    'nordic',
    'Nordheim',
  ])('matches the legacy detection for %j', (text) => {
    expect(containsAnyTerm(text, sorcery!.terms)).toBe(legacyIncludesTerm(text, sorcery!.terms));
    expect(containsAnyTerm(text, nord!.terms)).toBe(legacyIncludesTerm(text, nord!.terms));
  });

  it('only flags a trailing "Nord" when followed by a space or punctuation (as before)', () => {
    expect(containsAnyTerm('a Nord', nord!.terms)).toBe(false);
    expect(containsAnyTerm('a Nord.', nord!.terms)).toBe(true);
  });
});

describe('isFieldValid', () => {
  it('requires the minimum length for text fields', () => {
    const values = { ...completeValues(), name: 'Jo' };
    expect(isFieldValid(fields.name, values)).toBe(false);
    expect(isFieldValid(fields.name, { ...values, name: 'Joe' })).toBe(true);
  });

  it('requires a choice for select fields', () => {
    expect(isFieldValid(fields.nationality, { ...completeValues(), nationality: '' })).toBe(false);
  });

  it('never blocks on optional fields', () => {
    const values = {
      ...completeValues(),
      notes: '',
      kinksMaybe: '',
      timeZone: '',
      sexualityPreference: '',
    };
    for (const id of ['notes', 'kinksMaybe', 'timeZone', 'sexualityPreference'] as const) {
      expect(isFieldValid(fields[id], values)).toBe(true);
    }
  });
});

describe('formatError', () => {
  it('fills in the minimum length', () => {
    expect(formatError(fields.name)).toEqual([
      'Your character needs a name that is at least 3 symbols long.',
    ]);
    expect(formatError(fields.kinksYes)).toHaveLength(2);
    expect(formatError(fields.kinksYes)[1]).toBe(
      'This field needs a value that is at least 7 symbols long.',
    );
  });
});
