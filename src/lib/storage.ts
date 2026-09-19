import { AGE_DEFAULT, fields, fieldList, type FieldId, type FormValues } from './fields';

const STORAGE_KEY = 'characterSheetFormatter:v1';

/** Keys written by the first version of the site, which stored the whole form definition. */
const LEGACY_CURRENT_KEY = 'characterCurrent';
const LEGACY_DEFAULT_KEY = 'characterDefault';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function defaultValues(): FormValues {
  const values: Record<string, string | number | null> = {};
  for (const field of fieldList) {
    values[field.id] = field.id === 'age' ? AGE_DEFAULT : '';
  }
  return values as FormValues;
}

function readJson(storage: StorageLike, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Keeps only known fields with the right type; everything else falls back to its default. */
function normalize(input: unknown): FormValues {
  const values = defaultValues() as Record<string, string | number | null>;
  if (!isRecord(input)) return values as FormValues;

  for (const id of Object.keys(fields) as FieldId[]) {
    const stored = input[id];
    if (id === 'age') {
      if (typeof stored === 'number') values[id] = stored;
    } else if (typeof stored === 'string') {
      values[id] = stored;
    }
  }
  return values as FormValues;
}

/** The old format stored `{ [fieldId]: { value, ...definition } }`; only the values matter. */
function fromLegacy(legacy: unknown): FormValues {
  if (!isRecord(legacy)) return defaultValues();
  const flat: Record<string, unknown> = {};
  for (const [id, entry] of Object.entries(legacy)) {
    if (isRecord(entry)) flat[id] = entry.value;
  }
  return normalize(flat);
}

export function loadValues(storage: StorageLike): FormValues {
  const current = readJson(storage, STORAGE_KEY);
  if (isRecord(current) && isRecord(current.values)) return normalize(current.values);

  const legacy = readJson(storage, LEGACY_CURRENT_KEY);
  if (legacy === null) return defaultValues();

  const migrated = fromLegacy(legacy);
  saveValues(storage, migrated);
  clearLegacy(storage);
  return migrated;
}

export function saveValues(storage: StorageLike, values: FormValues): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, values }));
  } catch {
    // Storage may be full or disabled (e.g. private mode); the form still works without it.
  }
}

export function clearValues(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // See saveValues.
  }
  clearLegacy(storage);
}

function clearLegacy(storage: StorageLike): void {
  try {
    storage.removeItem(LEGACY_CURRENT_KEY);
    storage.removeItem(LEGACY_DEFAULT_KEY);
  } catch {
    // See saveValues.
  }
}

/** localStorage can throw when access is blocked, so resolve it defensively. */
export function getBrowserStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
