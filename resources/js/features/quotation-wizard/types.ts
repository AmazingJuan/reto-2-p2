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
    multiple: boolean;
    next_condition: number | null;
    options: PublicOption[];
};

export type ProfessionalOption = { id: number; years_experience: number };

export type QuoteViewData = {
    businessUnit: string;
    gestionLines: string[];
    services: Record<string, string[]>;
    /** Reachable conditions keyed by id. */
    conditions: Record<string, PublicCondition>;
    initial_condition_id: number | null;
    professionalsByGestionLine: Record<string, ProfessionalOption[]>;
};

export type RangeAnswer = { min: string; max: string };
/** Indexes of the chosen options plus the free text of an "Otro" option. */
export type OptionsAnswer = { selected: number[]; other: string };
export type Answer = string | RangeAnswer | OptionsAnswer;

/** A service added to the request, with the line it was picked from. */
export type PickedService = { line: string; service: string };

export type ContactData = { name: string; company: string; role: string; email: string; phone: string };
