import { fieldList, type FormValues } from '../src/lib/fields';
import type { LegacyCharacter } from './legacy-reference';

/** A fully filled-in, valid sheet. */
export function completeValues(): FormValues {
  return {
    name: 'Konan',
    age: 30,
    nationality: 'Darfari',
    backstory:
      'A wandering barbarian who arrived in the city after a long journey across the desert, looking for work.',
    notes: 'Some notes',
    sexuality: 'Gay',
    sexualityPreference: 'Female-preference',
    sexRole: 'Service Top',
    sexConsensual: 'Discuss',
    sexNonConsensual: 'Discuss',
    imprisonment: 'Discuss',
    slavery: 'Discuss',
    kinksYes: 'Spanking, Combat',
    kinksMaybe: 'Collars',
    kinksNo: 'Death, Drama',
    timeZone: 'West Europe',
    playTimes: 'Evenings',
    slowRolePlay: 'Initiate',
    playStylePreference: 'RP/PvE',
    rolePlayPreference: 'Story',
    experience: 'Forums',
  };
}

export function toLegacy(values: FormValues): LegacyCharacter {
  const legacy: LegacyCharacter = {};
  for (const field of fieldList) legacy[field.id] = { value: values[field.id] ?? '' };
  return legacy;
}

/** The exact text the original site produced for {@link completeValues} (captured from the live site). */
export const GOLDEN_SHEET = [
  '**__Character__**',
  '**Name:** Konan',
  '**Age:** 30',
  '**Nationality:** Darfari',
  '**Backstory:** A wandering barbarian who arrived in the city after a long journey across the desert, looking for work.',
  '**Special Notes:** Some notes',
  '',
  '----',
  '**__Consent__**',
  '**Sexuality:** Gay Female-preference',
  '**Sexual Role:** Service Top',
  '**Consensual Sex:** Discuss',
  '**Non-Consensual Sex:** Discuss',
  '**Imprisonment:** Discuss',
  '**Slavery:** Discuss',
  '**__Kinks__**',
  '**Yes:** Spanking, Combat',
  '**Maybe:** Collars',
  '**No:** Death, Drama',
  '',
  '----',
  '**__Player Details__**',
  '**Timezone/Playtimes:** West Europe / Evenings',
  '**When roleplay is slow, I will:** Initiate',
  '**Playstyle preference:** RP/PvE',
  '**Roleplay preference:** Story',
  '**Previous roleplay experience:** Forums',
].join('\n');
