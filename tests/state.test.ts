import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fieldList, type FormValues, type TextFieldId } from '../src/lib/fields';
import { FormState } from '../src/lib/state.svelte';
import { GOLDEN_SHEET, completeValues, toLegacy } from './fixtures';
import { legacyIsIncomplete } from './legacy-reference';

class MemoryStorage {
  data = new Map<string, string>();
  getItem = (key: string) => this.data.get(key) ?? null;
  setItem = (key: string, value: string) => void this.data.set(key, value);
  removeItem = (key: string) => void this.data.delete(key);
}

function fill(form: FormState, values: FormValues) {
  for (const field of fieldList) {
    if (field.id === 'age') form.setAge(values.age);
    else form.setText(field.id, values[field.id]);
  }
}

let storage: MemoryStorage;
let form: FormState;

beforeEach(() => {
  storage = new MemoryStorage();
  form = new FormState(storage);
});

describe('completeness', () => {
  it('starts incomplete and becomes complete when everything is filled in', () => {
    expect(form.isComplete).toBe(false);
    fill(form, completeValues());
    expect(form.isComplete).toBe(true);
  });

  it('matches the legacy check when each field is emptied in turn', () => {
    for (const field of fieldList) {
      if (field.id === 'age') continue;
      const values = { ...completeValues(), [field.id]: '' };
      const fresh = new FormState(new MemoryStorage());
      fill(fresh, values);
      expect(fresh.isComplete, `emptying ${field.id}`).toBe(!legacyIsIncomplete(toLegacy(values)));
    }
  });

  it('is not blocked by optional fields', () => {
    fill(form, {
      ...completeValues(),
      notes: '',
      kinksMaybe: '',
      timeZone: '',
      sexualityPreference: '',
    });
    expect(form.isComplete).toBe(true);
  });

  it('is incomplete when a required text field is shorter than its minimum', () => {
    fill(form, { ...completeValues(), kinksYes: 'abc' });
    expect(form.isComplete).toBe(false);
  });
});

describe('error flagging', () => {
  it('flags a required field on blur only when it is invalid', () => {
    form.blur('name');
    expect(form.flagged.name).toBe(true);

    form.setText('backstory', 'x'.repeat(100));
    form.blur('backstory');
    expect(form.flagged.backstory).toBeUndefined();
  });

  it('clears the flag as soon as the value becomes valid', () => {
    form.blur('name');
    form.setText('name', 'Jo');
    expect(form.flagged.name).toBe(true);
    form.setText('name', 'Joe');
    expect(form.flagged.name).toBe(false);
  });

  it('never flags optional fields', () => {
    for (const id of ['notes', 'kinksMaybe', 'timeZone', 'sexualityPreference'] as TextFieldId[]) {
      form.blur(id);
      expect(form.flagged[id]).toBeUndefined();
    }
  });

  it('clears select flags when an option is chosen', () => {
    form.blur('nationality');
    expect(form.flagged.nationality).toBe(true);
    form.setText('nationality', 'Kushite');
    expect(form.flagged.nationality).toBe(false);
  });
});

describe('input handling', () => {
  it('strips non-letters from the name', () => {
    form.setText('name', 'Konan 123!');
    expect(form.values.name).toBe('Konan ');
  });

  it('clamps the age when it is committed', () => {
    form.setAge(12);
    form.commitAge();
    expect(form.values.age).toBe(18);
    form.setAge(100);
    form.commitAge();
    expect(form.values.age).toBe(69);
    form.setAge(null);
    form.commitAge();
    expect(form.values.age).toBe(18);
  });
});

describe('copying', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockReset();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
  });

  it('does nothing while the sheet is incomplete', async () => {
    expect(await form.copySheet()).toBeNull();
    expect(writeText).not.toHaveBeenCalled();
    expect(form.copied).toBe(false);
  });

  it('copies the sheet and marks it as copied until the next edit', async () => {
    fill(form, completeValues());
    writeText.mockResolvedValue(undefined);

    expect(await form.copySheet()).toBe(true);
    expect(writeText).toHaveBeenCalledWith(GOLDEN_SHEET);
    expect(form.copied).toBe(true);
    expect(form.sheetLength).toBe(GOLDEN_SHEET.length);

    form.setText('notes', 'changed');
    expect(form.copied).toBe(false);
  });

  it('reports a failed copy', async () => {
    fill(form, completeValues());
    writeText.mockRejectedValue(new Error('denied'));
    expect(await form.copySheet()).toBe(false);
    expect(form.copied).toBe(false);
  });
});

describe('persistence and reset', () => {
  it('restores values in a new session', () => {
    fill(form, completeValues());
    expect($stateSnapshot(new FormState(storage).values)).toEqual(completeValues());
  });

  it('reset returns to defaults and forgets stored values', () => {
    fill(form, completeValues());
    form.blur('name');
    form.reset();

    expect(form.values.name).toBe('');
    expect(form.values.age).toBe(18);
    expect(form.flagged).toEqual({});
    expect(new FormState(storage).values.name).toBe('');
  });
});

function $stateSnapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
