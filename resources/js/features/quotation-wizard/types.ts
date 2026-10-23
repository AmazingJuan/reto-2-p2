import type { SectionKey } from './sections';

export type PublicOption = {
    label: string;
    value: string | null;
    is_other: boolean;
    next_condition: number | null;
};

export type PublicCondition = {
    label: string;
    interaction_type: 'input' | 'range' | 'options';
    type: 'text' | 'number' | 'date';
    observation: string | null;
    /** Example of the expected answer, shown inside the field. */
    placeholder: string | null;
    /** Free text answered in a long field. */
    multiline: boolean;
    multiple: boolean;
    /** Block of the encuadre (see sections.ts); null = no block. */
    section: SectionKey | null;
    required: boolean;
    next_condition: number | null;
    options: PublicOption[];
};

export type QuoteViewData = {
    businessUnit: string;
    /** Slug of the unit (its URL), which also keys the draft. */
    unit: string;
    /** Units that can be quoted, for the tabs. */
    units: { name: string; display_name: string }[];
    /** Reachable conditions (the unit's encuadre) keyed by id. */
    conditions: Record<string, PublicCondition>;
    initial_condition_id: number | null;
};

export type RangeAnswer = { min: string; max: string };
/** Indexes of the chosen options plus the free text of an "Otro" option. */
export type OptionsAnswer = { selected: number[]; other: string };
export type Answer = string | RangeAnswer | OptionsAnswer;

export type ContactData = {
    name: string;
    company: string;
    nit: string;
    economic_activity: string;
    address: string;
    role: string;
    email: string;
    phone: string;
};
