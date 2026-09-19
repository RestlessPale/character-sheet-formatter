import type { FormValues } from './fields';

/** Builds the Discord-formatted character sheet from the form values. */
export function buildSheet(values: FormValues): string {
  const v = values;
  const sexuality = v.sexualityPreference ? `${v.sexuality} ${v.sexualityPreference}` : v.sexuality;
  const timeZone = v.timeZone ? `${v.timeZone} / ` : '';

  return (
    `**__Character__**\n` +
    `**Name:** ${v.name}\n` +
    `**Age:** ${v.age}\n` +
    `**Nationality:** ${v.nationality}\n` +
    `**Backstory:** ${v.backstory}\n` +
    `**Special Notes:** ${v.notes}\n` +
    `\n` +
    `----\n` +
    `**__Consent__**\n` +
    `**Sexuality:** ${sexuality}\n` +
    `**Sexual Role:** ${v.sexRole}\n` +
    `**Consensual Sex:** ${v.sexConsensual}\n` +
    `**Non-Consensual Sex:** ${v.sexNonConsensual}\n` +
    `**Imprisonment:** ${v.imprisonment}\n` +
    `**Slavery:** ${v.slavery}\n` +
    `**__Kinks__**\n` +
    `**Yes:** ${v.kinksYes}\n` +
    `**Maybe:** ${v.kinksMaybe}\n` +
    `**No:** ${v.kinksNo}\n` +
    `\n` +
    `----\n` +
    `**__Player Details__**\n` +
    `**Timezone/Playtimes:** ${timeZone}${v.playTimes}\n` +
    `**When roleplay is slow, I will:** ${v.slowRolePlay}\n` +
    `**Playstyle preference:** ${v.playStylePreference}\n` +
    `**Roleplay preference:** ${v.rolePlayPreference}\n` +
    `**Previous roleplay experience:** ${v.experience}`
  );
}
