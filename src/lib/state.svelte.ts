import { copyText } from './clipboard';
import { fieldList, fields, type FieldId, type FormValues, type TextFieldId } from './fields';
import { buildSheet } from './sheet';
import { clearValues, defaultValues, loadValues, saveValues, getBrowserStorage } from './storage';
import { clampAge, isFieldValid, isSheetComplete, sanitizeName } from './validation';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Reactive state of the whole form: values, which fields show an error, and the copy status. */
export class FormState {
  values = $state<FormValues>(defaultValues());
  /** Fields whose error message is currently shown. Set on blur, cleared once the value is valid. */
  flagged = $state<Partial<Record<FieldId, boolean>>>({});
  /** True after a successful copy, until the sheet is edited again. */
  copied = $state(false);
  /** Length of the last sheet that was built for copying (0 until the first copy attempt). */
  sheetLength = $state(0);

  isComplete = $derived(isSheetComplete(fieldList, this.values));

  readonly #storage: StorageLike | null;

  constructor(storage: StorageLike | null = getBrowserStorage()) {
    this.#storage = storage;
    if (storage) this.values = loadValues(storage);
  }

  setText(id: TextFieldId, value: string): void {
    this.values[id] = id === 'name' ? sanitizeName(value) : value;
    this.#changed(id);
  }

  setAge(value: number | null): void {
    this.values.age = value;
    this.#changed('age');
  }

  /** Called when a field is left: required fields with an invalid value start showing their error. */
  blur(id: FieldId): void {
    const field = fields[id];
    if (!isFieldValid(field, this.values)) this.flagged[id] = true;
  }

  /** Called on edits: an error that was showing disappears as soon as the value becomes valid. */
  #changed(id: FieldId): void {
    this.copied = false;
    if (this.flagged[id] && isFieldValid(fields[id], this.values)) this.flagged[id] = false;
    this.#save();
  }

  /** Called when the age input is committed: puts the value back inside the allowed range. */
  commitAge(): void {
    const age = fields.age;
    if (age.kind !== 'number') return;
    this.values.age = clampAge(this.values.age, age);
    this.#changed('age');
  }

  reset(): void {
    this.values = defaultValues();
    this.flagged = {};
    this.copied = false;
    if (this.#storage) clearValues(this.#storage);
  }

  /** Copies the sheet to the clipboard. Returns false when the copy failed. */
  async copySheet(): Promise<boolean | null> {
    if (!this.isComplete) return null;
    const sheet = buildSheet(this.values);
    this.sheetLength = sheet.length;
    try {
      await copyText(sheet);
      this.copied = true;
      return true;
    } catch {
      return false;
    }
  }

  #save(): void {
    if (this.#storage) saveValues(this.#storage, $state.snapshot(this.values));
  }
}
