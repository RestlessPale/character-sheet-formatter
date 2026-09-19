export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export type SelectChoices =
  | { groups: SelectOptionGroup[]; options?: undefined }
  | { options: SelectOption[]; groups?: undefined };

interface Nationality {
  nation: string;
  nationality: string;
}

const nationalityGroups: Record<string, { label: string; nationalities: Nationality[] }> = {
  nordheim: {
    label: 'Nordheim',
    nationalities: [
      { nation: 'Asgard', nationality: 'Aesir' },
      { nation: 'Vanaheim', nationality: 'Vanir' },
    ],
  },
  hyboria: {
    label: 'Hyboria',
    nationalities: [
      { nation: 'Aquilonia', nationality: 'Aquilonian' },
      { nation: 'Argos', nationality: 'Argossean' },
      { nation: 'Border Kingdom', nationality: 'Borderer' },
      { nation: 'Brythunia', nationality: 'Brythunian' },
      { nation: 'Corinthia', nationality: 'Corinthian' },
      { nation: 'Koth', nationality: 'Kothian' },
      { nation: 'Nemedia', nationality: 'Nemedian' },
      { nation: 'Ophir', nationality: 'Ophirian' },
    ],
  },
  greatDesert: {
    label: 'Great Desert Nations',
    nationalities: [
      { nation: 'Shem', nationality: 'Shemite' },
      { nation: 'Stygia', nationality: 'Stygian' },
    ],
  },
  farEast: {
    label: 'Far Eastern Nations',
    nationalities: [
      { nation: 'Kambuja', nationality: 'Kambujan' },
      { nation: 'Khitai', nationality: 'Khitan' },
      { nation: 'Yamatai', nationality: 'Yamatai' },
    ],
  },
  himelia: {
    label: 'Himelian Mountains',
    nationalities: [
      { nation: 'Ghulistan', nationality: 'Ghulistani' },
      { nation: 'Meru', nationality: 'Meruvian' },
      // { nation: 'Uttara Kuru', nationality: 'Uttaran' },
    ],
  },
  fertileCrescent: {
    label: 'Fertile Crescent',
    nationalities: [
      { nation: 'Drujistan', nationality: 'Drujistani' },
      { nation: 'Iranistan', nationality: 'Iranistani' },
      { nation: 'Vendhya', nationality: 'Vendhyan' },
    ],
  },
  blackKingdoms: {
    label: 'Black Kingdoms',
    nationalities: [
      { nation: 'Amazon', nationality: 'Amazonian' },
      { nation: 'Darfar', nationality: 'Darfari' },
      { nation: 'Keshan', nationality: 'Keshani' },
      { nation: 'Kush', nationality: 'Kushite' },
      { nation: 'Punt', nationality: 'Puntish' },
      { nation: 'Zembabwei', nationality: 'Zembabweian' },
      { nation: 'Southern Black Kingdoms', nationality: 'Southerner' },
    ],
  },
  otherNations: {
    label: 'Others',
    nationalities: [
      { nation: 'Cimmeria', nationality: 'Cimmerian' },
      // { nation: 'Hyperborea', nationality: 'Hyperborean' },
      { nation: 'Hyrkania', nationality: 'Hyrkanian' },
      { nation: 'Pictish Wilderness', nationality: 'Pict' },
      { nation: 'Turan', nationality: 'Turanian' },
      { nation: 'Zamora', nationality: 'Zamorian' },
      { nation: 'Zingara', nationality: 'Zingaran' },
    ],
  },
};

/** Groups are shown in this order (alphabetical by key, as on the original site). */
const nationalityGroupOrder = [
  'blackKingdoms',
  'farEast',
  'fertileCrescent',
  'greatDesert',
  'himelia',
  'hyboria',
  'nordheim',
  'otherNations',
] as const;

export const nationalityChoices: SelectChoices = {
  groups: nationalityGroupOrder.map((key) => {
    const group = nationalityGroups[key]!;
    return {
      label: group.label,
      options: group.nationalities.map(({ nation, nationality }) => ({
        value: nationality,
        label: `${nationality} (${nation})`,
      })),
    };
  }),
};

const sexualities = [
  { sexuality: 'Heterosexual', publicTerm: 'Straight' },
  { sexuality: 'Homosexual', publicTerm: 'Lesbian' },
  { sexuality: 'Homosexual', publicTerm: 'Gay' },
  { sexuality: 'Bisexual', publicTerm: 'Bisexual' },
  { sexuality: 'Pansexual', publicTerm: 'Pansexual' },
  { sexuality: 'Demisexual', publicTerm: 'Demisexual' },
  { sexuality: 'Asexual', publicTerm: 'Asexual' },
  { sexuality: 'Androsexual', publicTerm: 'Androsexual' },
  { sexuality: 'Gynosexual', publicTerm: 'Gynosexual' },
  { sexuality: 'Unsure', publicTerm: 'Unsure' },
];

export const sexualityChoices: SelectChoices = {
  options: sexualities.map(({ sexuality, publicTerm }) => ({
    value: publicTerm,
    label: sexuality === publicTerm ? sexuality : `${sexuality} / "${publicTerm}"`,
  })),
};

const plain = (values: string[]): SelectOption[] =>
  values.map((value) => ({ value, label: value }));

export const sexualityPreferenceChoices: SelectChoices = {
  options: plain([
    'Male-preference',
    'Female-preference',
    'Trans-preference',
    'Masculine-preference',
    'Feminine-preference',
    'Androgyny-preference',
  ]),
};

export const sexRoleChoices: SelectChoices = {
  options: plain(['Dominant', 'Service Top', 'Switch', 'Power Bottom', 'Submissive', 'None']),
};

export const playStyleChoices: SelectChoices = {
  options: plain(['RP', 'RP/PvE', 'RP/PvP', 'RP/PvE/PvP']),
};

/** Values are what ends up in the copied sheet (Discord emoji shortcodes). */
export const consentChoices: SelectChoices = {
  options: [
    { value: ':white_check_mark:', label: '✔️Yes' },
    { value: 'Discuss', label: '🔶Discuss' },
    { value: ':x:', label: '❌No' },
  ],
};
