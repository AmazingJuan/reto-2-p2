export type InteractionType = 'input' | 'range' | 'options';
export type ValueType = 'text' | 'number' | 'date';

export type OptionData = {
    /** Database id; absent for options not saved yet. */
    id?: number | null;
    label: string;
    /** Opaque value stored with the option; preserved on save. */
    value: string | null;
    is_other: boolean;
    /** Branch: where this option leads. null = the question's default next. */
    next_condition: number | null;
};

export type ConditionData = {
    /** Database id, or a negative id for a question being created. */
    id: number;
    label: string;
    interaction_type: InteractionType;
    type: ValueType;
    observation: string | null;
    multiple: boolean;
    /** Default next question; null ends the questionnaire. */
    next_condition: number | null;
    options: OptionData[];
};

export type TreeData = {
    id: number;
    name: string;
    initial_condition_id: number | null;
    conditions: ConditionData[];
};

/**
 * What the admin picks: one plain choice instead of the three stored fields
 * (interaction_type, type, multiple).
 */
export type AnswerKind = 'text' | 'number' | 'date' | 'number-range' | 'date-range' | 'single' | 'multiple';

export const answerKinds: { kind: AnswerKind; label: string; example: string }[] = [
    { kind: 'single', label: 'Una opción', example: 'Sí / No' },
    { kind: 'multiple', label: 'Varias opciones', example: 'Marque todas las que apliquen' },
    { kind: 'text', label: 'Texto libre', example: 'Nombre del proyecto' },
    { kind: 'number', label: 'Número', example: 'Cantidad de empleados' },
    { kind: 'date', label: 'Fecha', example: 'Fecha de inicio' },
    { kind: 'number-range', label: 'Rango de números', example: 'De 10 a 50 personas' },
    { kind: 'date-range', label: 'Rango de fechas', example: 'Del 1 al 15 de marzo' },
];

export function kindOf(condition: ConditionData): AnswerKind {
    if (condition.interaction_type === 'options') return condition.multiple ? 'multiple' : 'single';
    if (condition.interaction_type === 'range') return condition.type === 'date' ? 'date-range' : 'number-range';
    return condition.type;
}

export const kindLabel = (condition: ConditionData) => answerKinds.find((k) => k.kind === kindOf(condition))?.label ?? '';

/** Store a kind back into the three fields. Options are kept so switching back restores them. */
export function withKind(condition: ConditionData, kind: AnswerKind): ConditionData {
    const fields: Record<AnswerKind, Pick<ConditionData, 'interaction_type' | 'type' | 'multiple'>> = {
        text: { interaction_type: 'input', type: 'text', multiple: false },
        number: { interaction_type: 'input', type: 'number', multiple: false },
        date: { interaction_type: 'input', type: 'date', multiple: false },
        'number-range': { interaction_type: 'range', type: 'number', multiple: false },
        'date-range': { interaction_type: 'range', type: 'date', multiple: false },
        single: { interaction_type: 'options', type: 'text', multiple: false },
        multiple: { interaction_type: 'options', type: 'text', multiple: true },
    };
    const next = { ...condition, ...fields[kind] };
    if (next.interaction_type === 'options' && next.options.length === 0) {
        next.options = [blankOption(), blankOption()];
    }
    return next;
}

export const blankOption = (): OptionData => ({ label: '', value: null, is_other: false, next_condition: null });

export const isChoice = (condition: ConditionData) => condition.interaction_type === 'options';
/** Only single-choice questions can branch per option. */
export const canBranch = (condition: ConditionData) => condition.interaction_type === 'options' && !condition.multiple;
