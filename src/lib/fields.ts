import {
  consentChoices,
  nationalityChoices,
  playStyleChoices,
  sexRoleChoices,
  sexualityChoices,
  sexualityPreferenceChoices,
  type SelectChoices,
} from './options';

export type FieldId =
  | 'name'
  | 'age'
  | 'nationality'
  | 'backstory'
  | 'notes'
  | 'sexuality'
  | 'sexualityPreference'
  | 'sexRole'
  | 'sexConsensual'
  | 'sexNonConsensual'
  | 'imprisonment'
  | 'slavery'
  | 'kinksYes'
  | 'kinksMaybe'
  | 'kinksNo'
  | 'timeZone'
  | 'playTimes'
  | 'slowRolePlay'
  | 'playStylePreference'
  | 'rolePlayPreference'
  | 'experience';

export type TextFieldId = Exclude<FieldId, 'age'>;

/** Everything the user types or picks. Age is the only numeric field. */
export type FormValues = Record<TextFieldId, string> & { age: number | null };

interface BaseField {
  /** Id of the wrapper element; the control gets a suffix (`Input` / `TextArea`). */
  htmlId: string;
  title: string;
  optional: boolean;
  /** Lines shown as an error, joined with line breaks. `{min}` is replaced by the minimum length. */
  errorLines: string[];
}

export interface TextField extends BaseField {
  id: TextFieldId;
  kind: 'text' | 'textarea';
  min: number;
  max: number;
  placeholder: string;
  /** Height of a textarea on wide screens (narrow screens use a fixed larger height). */
  textareaHeight?: string;
  /** Warnings shown while the text contains one of the terms (case-insensitive). */
  termAlerts?: { terms: string[]; message: string }[];
}

export interface NumberField extends BaseField {
  id: 'age';
  kind: 'number';
  min: number;
  max: number;
  placeholder: string;
}

export interface SelectField extends BaseField {
  id: TextFieldId;
  kind: 'select';
  choices: SelectChoices;
}

export type Field = TextField | NumberField | SelectField;

/** Maximum number of symbols Discord accepts in a single message. */
export const TOTAL_MAX_LENGTH = 2000;

export const AGE_DEFAULT = 18;

type TextOptions = Pick<TextField, 'min' | 'max' | 'placeholder' | 'errorLines'> &
  Partial<Pick<TextField, 'kind' | 'optional' | 'termAlerts' | 'textareaHeight'>>;

const text = (id: TextFieldId, htmlId: string, title: string, options: TextOptions): TextField => ({
  kind: 'text',
  optional: false,
  ...options,
  id,
  htmlId,
  title,
});

const select = (
  id: TextFieldId,
  htmlId: string,
  title: string,
  choices: SelectChoices,
  errorLines: string[],
  optional = false,
): SelectField => ({ kind: 'select', id, htmlId, title, choices, errorLines, optional });

const longAnswerError = ['Your answer to this question needs to be at least {min} symbols long.'];
const answerError = ['You need to select an answer.'];

export const fields: Record<FieldId, Field> = {
  name: text('name', 'charName', 'Name', {
    min: 3,
    max: 25,
    placeholder: "Your character's name",
    errorLines: ['Your character needs a name that is at least {min} symbols long.'],
  }),
  age: {
    id: 'age',
    kind: 'number',
    htmlId: 'charAge',
    title: 'Age',
    optional: false,
    min: 18,
    max: 69,
    placeholder: "Your character's age",
    errorLines: ["Your character can't be younger than 18 years old."],
  },
  nationality: select('nationality', 'charNationality', 'Nationality', nationalityChoices, [
    'You need to choose a nationality for your character.',
  ]),
  backstory: text('backstory', 'charBackstory', 'Backstory', {
    kind: 'textarea',
    textareaHeight: '100px',
    min: 100,
    max: 400,
    placeholder:
      'Who is your character and how have they arrived in Port Tantula? Your character does not need to be exiled to be here!',
    errorLines: ["Your character's backstory needs to be at least {min} symbols long."],
    termAlerts: [
      {
        terms: ['mage', 'magic', 'sorcerer', 'sorceress', 'sorcery', 'witch'],
        message:
          'Make sure your character does not have any sorcerous or magical skills! We have a separate application form for sorcery skills.',
      },
      {
        terms: ['nord ', 'nord,', 'nord.', 'nords ', 'nords,', 'nords.'],
        message:
          "The term 'Nord' has been detected. Be aware that 'Nord' or 'Nords' aren't a thing in the Hyborian Age setting. Use Nordheimer, Vanir or Aesir instead!",
      },
    ],
  }),
  notes: text('notes', 'charNotes', 'Notes', {
    kind: 'textarea',
    optional: true,
    min: 0,
    max: 100,
    placeholder: 'Optional extra notes about your character.',
    errorLines: [],
  }),
  sexuality: select('sexuality', 'charSexuality', 'Sexuality', sexualityChoices, [
    'You need to select a sexuality for your character.',
  ]),
  sexualityPreference: select(
    'sexualityPreference',
    'charSexualityPreference',
    'Sexuality Preference',
    sexualityPreferenceChoices,
    [],
    true,
  ),
  sexRole: select('sexRole', 'charSexRole', 'Sexual Role', sexRoleChoices, [
    'You need to select a role for your character.',
  ]),
  sexConsensual: select(
    'sexConsensual',
    'charSexConsensual',
    'In-character Consensual Sex?',
    consentChoices,
    answerError,
  ),
  sexNonConsensual: select(
    'sexNonConsensual',
    'charSexNonConsensual',
    'In-character Non-Consensual Sex?',
    consentChoices,
    answerError,
  ),
  imprisonment: select(
    'imprisonment',
    'charImprisonment',
    'In-character Imprisonment?',
    consentChoices,
    answerError,
  ),
  slavery: select('slavery', 'charSlavery', 'In-character Slavery?', consentChoices, answerError),
  kinksYes: text('kinksYes', 'charKinksYes', 'Kinks: Yes', {
    kind: 'textarea',
    min: 7,
    max: 250,
    placeholder:
      'A comma-separated list of the kinks you like your character to be involved with. (e.g.; Spanking, Butts, Combat)',
    errorLines: [
      'Enter some kinks you consent to! Alternatively, you may choose to enter something like "Discuss beforehand."',
      'This field needs a value that is at least {min} symbols long.',
    ],
  }),
  kinksMaybe: text('kinksMaybe', 'charKinksMaybe', 'Kinks: Maybe', {
    kind: 'textarea',
    optional: true,
    min: 0,
    max: 100,
    placeholder:
      'A comma-separated list of the kinks you are open for discussion for. (e.g.; Collars, Blindfolds, Lemons)',
    errorLines: [],
  }),
  kinksNo: text('kinksNo', 'charKinksNo', 'Kinks: No', {
    kind: 'textarea',
    min: 7,
    max: 250,
    placeholder:
      'A comma-separated list of the kinks that are hard limits for you. You do not want your character involved with any of these. (e.g.; Death, Drama, Rape)',
    errorLines: [
      'Enter some kinks you do not consent to! Alternatively, you may choose to enter something like "Discuss beforehand."',
      'This field needs a value that is at least {min} symbols long.',
    ],
  }),
  timeZone: text('timeZone', 'playerTimezone', 'Timezone', {
    optional: true,
    min: 0,
    max: 25,
    placeholder: 'NA-East, West Europe, ...',
    errorLines: [],
  }),
  playTimes: text('playTimes', 'playerPlayTimes', 'When do you usually play?', {
    min: 5,
    max: 50,
    placeholder: 'Evenings, weekends, ...',
    errorLines: longAnswerError,
  }),
  slowRolePlay: text(
    'slowRolePlay',
    'playerSlowRolePlay',
    'What do you do when roleplay is slow?',
    {
      min: 5,
      max: 50,
      placeholder: 'Wait, initiate, play the game, ...',
      errorLines: longAnswerError,
    },
  ),
  playStylePreference: select(
    'playStylePreference',
    'playerPlayStylePreference',
    'Playstyle Preference?',
    playStyleChoices,
    ['Select a preference.'],
  ),
  rolePlayPreference: text(
    'rolePlayPreference',
    'playerRolePlayPreference',
    'Roleplay Type Preference?',
    {
      min: 5,
      max: 50,
      placeholder: 'Social, ERP, Groups, Story, ...',
      errorLines: longAnswerError,
    },
  ),
  experience: text('experience', 'playerExperience', 'Previous roleplay experience?', {
    min: 5,
    max: 50,
    placeholder: 'Other games, TTRPG, Forums, ...',
    errorLines: longAnswerError,
  }),
};

export const fieldList: Field[] = Object.values(fields);

export interface Section {
  id: string;
  title: string;
  /** Each row lays its fields out in columns (widths apply on wide screens; narrow screens stack). */
  rows: { columns: string[]; fields: FieldId[] }[];
}

export const sections: Section[] = [
  {
    id: 'sectionCharacter',
    title: 'Character Info',
    rows: [
      { columns: ['40%', '20%', '40%'], fields: ['name', 'age', 'nationality'] },
      { columns: ['100%'], fields: ['backstory', 'notes'] },
    ],
  },
  {
    id: 'sectionConsent',
    title: 'Consent & Kinks',
    rows: [
      { columns: ['50%', '25%', '25%'], fields: ['sexuality', 'sexualityPreference', 'sexRole'] },
      {
        columns: ['25%', '25%', '25%', '25%'],
        fields: ['sexConsensual', 'sexNonConsensual', 'imprisonment', 'slavery'],
      },
      { columns: ['100%'], fields: ['kinksYes', 'kinksMaybe', 'kinksNo'] },
    ],
  },
  {
    id: 'sectionPlayer',
    title: 'Player Info',
    rows: [
      { columns: ['25%', '37.5%', '37.5%'], fields: ['timeZone', 'playTimes', 'slowRolePlay'] },
      {
        columns: ['25%', '37.5%', '37.5%'],
        fields: ['playStylePreference', 'rolePlayPreference', 'experience'],
      },
    ],
  },
];
