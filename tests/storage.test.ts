import { describe, expect, it } from 'vitest';
import { clearValues, defaultValues, loadValues, saveValues } from '../src/lib/storage';
import { completeValues } from './fixtures';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

/** The shape the original site wrote to localStorage: every field with its whole definition. */
function legacyBlob(values: Record<string, string | number>) {
  const blob: Record<string, unknown> = {};
  for (const [id, value] of Object.entries(values)) {
    blob[id] = {
      value,
      type: 'text',
      min: 3,
      max: 25,
      optional: false,
      title: id,
      isLessThanMinimum: false,
    };
  }
  return JSON.stringify(blob);
}

describe('storage', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadValues(memoryStorage())).toEqual(defaultValues());
    expect(defaultValues().age).toBe(18);
  });

  it('round-trips values', () => {
    const storage = memoryStorage();
    saveValues(storage, completeValues());
    expect(loadValues(storage)).toEqual(completeValues());
  });

  it('migrates the legacy format and removes the old keys', () => {
    const storage = memoryStorage({
      characterCurrent: legacyBlob(completeValues() as Record<string, string | number>),
      characterDefault: legacyBlob({}),
    });

    expect(loadValues(storage)).toEqual(completeValues());
    expect(storage.data.has('characterCurrent')).toBe(false);
    expect(storage.data.has('characterDefault')).toBe(false);
    // Migrated data is now stored in the new format.
    expect(loadValues(storage)).toEqual(completeValues());
  });

  it('ignores unknown or wrongly typed entries', () => {
    const storage = memoryStorage({
      'characterSheetFormatter:v1': JSON.stringify({
        version: 1,
        values: { name: 42, age: 'old', extra: 'x', notes: 'ok' },
      }),
    });
    const values = loadValues(storage);
    expect(values.name).toBe('');
    expect(values.age).toBe(18);
    expect(values.notes).toBe('ok');
    expect(values).not.toHaveProperty('extra');
  });

  it('survives corrupt data', () => {
    expect(loadValues(memoryStorage({ 'characterSheetFormatter:v1': '{nope' }))).toEqual(
      defaultValues(),
    );
    expect(loadValues(memoryStorage({ characterCurrent: 'nope' }))).toEqual(defaultValues());
  });

  it('clears the current and legacy keys', () => {
    const storage = memoryStorage({ characterCurrent: '{}', characterDefault: '{}' });
    saveValues(storage, completeValues());
    clearValues(storage);
    expect(storage.data.size).toBe(0);
  });
});
