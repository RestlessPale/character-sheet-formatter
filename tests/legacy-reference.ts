/**
 * Verbatim copies of the pre-refactor logic from the original single-file App.svelte,
 * adapted only to take a plain object. Used to prove the refactor did not change behavior.
 */

type LegacyEntry = { value: string | number; isLessThanMinimum?: boolean; isNotSelected?: boolean };
export type LegacyCharacter = Record<string, LegacyEntry>;

export function legacyBuildSheet(character: LegacyCharacter): string {
  return (
    `**__Character__**\n` +
    `**Name:** ${character.name!.value}\n` +
    `**Age:** ${character.age!.value}\n` +
    `**Nationality:** ${character.nationality!.value}\n` +
    `**Backstory:** ${character.backstory!.value}\n` +
    `**Special Notes:** ${character.notes!.value}\n` +
    `\n` +
    `----\n` +
    `**__Consent__**\n` +
    `**Sexuality:** ${character.sexuality!.value}${character.sexualityPreference!.value ? ' ' + character.sexualityPreference!.value : ''}\n` +
    `**Sexual Role:** ${character.sexRole!.value}\n` +
    `**Consensual Sex:** ${character.sexConsensual!.value}\n` +
    `**Non-Consensual Sex:** ${character.sexNonConsensual!.value}\n` +
    `**Imprisonment:** ${character.imprisonment!.value}\n` +
    `**Slavery:** ${character.slavery!.value}\n` +
    `**__Kinks__**\n` +
    `**Yes:** ${character.kinksYes!.value}\n` +
    `**Maybe:** ${character.kinksMaybe!.value}\n` +
    `**No:** ${character.kinksNo!.value}\n` +
    `\n` +
    `----\n` +
    `**__Player Details__**\n` +
    `**Timezone/Playtimes:** ${character.timeZone!.value ? character.timeZone!.value + ' / ' : ''}${character.playTimes!.value}\n` +
    `**When roleplay is slow, I will:** ${character.slowRolePlay!.value}\n` +
    `**Playstyle preference:** ${character.playStylePreference!.value}\n` +
    `**Roleplay preference:** ${character.rolePlayPreference!.value}\n` +
    `**Previous roleplay experience:** ${character.experience!.value}`
  );
}

/** The old check: returns true when the sheet is still INCOMPLETE. */
export function legacyIsIncomplete(c: LegacyCharacter): boolean {
  const text = [
    'name',
    'backstory',
    'kinksYes',
    'kinksNo',
    'playTimes',
    'slowRolePlay',
    'experience',
    'rolePlayPreference',
  ];
  const select = [
    'nationality',
    'sexuality',
    'sexRole',
    'sexConsensual',
    'sexNonConsensual',
    'imprisonment',
    'slavery',
    'playStylePreference',
  ];
  return (
    text.some((id) => c[id]!.value == '' || c[id]!.isLessThanMinimum) ||
    select.some((id) => c[id]!.value == '' || c[id]!.isNotSelected)
  );
}

/** The old name filter. */
export const legacyValidateTextOnly = (value: string): string => value.replace(/[^a-zA-Z\s]/g, '');

/** The old term detection (backstory). */
export const legacyIncludesTerm = (value: string, terms: string[]): boolean =>
  terms.some((word) => value.toLowerCase().includes(word.toLowerCase()));

/** The old age clamp. */
export function legacyValidateAge(value: unknown, min = 18, max = 69): number {
  if (typeof value !== 'number') return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
