import type { Field, FormValues, NumberField, TextField } from './fields';

/** Names may only contain letters and whitespace. */
export function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, '');
}

/** Keeps the age within the allowed range; anything that is not a number falls back to the minimum. */
export function clampAge(value: number | null, field: NumberField): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < field.min) return field.min;
  if (value > field.max) return field.max;
  return value;
}

/** True while the age is below the minimum (an empty input counts as below). */
export function isAgeTooLow(value: number | null, field: NumberField): boolean {
  return (value ?? 0) < field.min;
}

export function containsAnyTerm(text: string, terms: readonly string[]): boolean {
  const lowered = text.toLowerCase();
  return terms.some((term) => lowered.includes(term.toLowerCase()));
}

/** Whether a single field currently holds an acceptable value. Optional fields always do. */
export function isFieldValid(field: Field, values: FormValues): boolean {
  if (field.optional || field.kind === 'number') return true;
  const value = values[field.id];
  if (field.kind === 'select') return value !== '';
  return value !== '' && value.length >= field.min;
}

export function isSheetComplete(fieldList: readonly Field[], values: FormValues): boolean {
  return fieldList.every((field) => isFieldValid(field, values));
}

export function isTextField(field: Field): field is TextField {
  return field.kind === 'text' || field.kind === 'textarea';
}

export function formatError(field: Field): string[] {
  return field.errorLines.map((line) =>
    'min' in field ? line.replace('{min}', String(field.min)) : line,
  );
}
