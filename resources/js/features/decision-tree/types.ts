import type { SectionKey } from '@/features/quotation-wizard/sections';

export type InteractionType = 'input' | 'range' | 'options';
export type ValueType = 'text' | 'number' | 'date' | 'file';

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
    /** Example of the expected answer, shown inside the field (open questions). */
    placeholder: string | null;
    /** Free text answered in a long field. */
    multiline: boolean;
    multiple: boolean;
    /** Block of the encuadre it belongs to; null = none. */
    section: SectionKey | null;
    /** false lets the client skip it. */
    required: boolean;
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
export type AnswerKind = 'text' | 'long-text' | 'number' | 'date' | 'file' | 'number-range' | 'date-range' | 'single' | 'multiple';

export const answerKinds: { kind: AnswerKind; label: string; example: string }[] = [
    { kind: 'single', label: 'Una opción', example: 'Sí / No' },
    { kind: 'multiple', label: 'Varias opciones', example: 'Marque todas las que apliquen' },
    { kind: 'text', label: 'Texto corto', example: 'Ente certificador' },
    { kind: 'long-text', label: 'Texto largo', example: 'Descripción del servicio' },
    { kind: 'number', label: 'Número', example: 'Cantidad de empleados' },
    { kind: 'date', label: 'Fecha', example: 'Fecha de inicio' },
    { kind: 'file', label: 'Documentos', example: 'Adjuntar mapa de procesos' },
    { kind: 'number-range', label: 'Rango de números', example: 'De 10 a 50 personas' },
    { kind: 'date-range', label: 'Rango de fechas', example: 'Del 1 al 15 de marzo' },
];

export function kindOf(condition: ConditionData): AnswerKind {
    if (condition.interaction_type === 'options') return condition.multiple ? 'multiple' : 'single';
    if (condition.interaction_type === 'range') return condition.type === 'date' ? 'date-range' : 'number-range';
    if (condition.type === 'text' && condition.multiline) return 'long-text';
    return condition.type;
}

export const kindLabel = (condition: ConditionData) => answerKinds.find((k) => k.kind === kindOf(condition))?.label ?? '';

/** Store a kind back into the three fields. Options are kept so switching back restores them. */
export function withKind(condition: ConditionData, kind: AnswerKind): ConditionData {
    const fields: Record<AnswerKind, Pick<ConditionData, 'interaction_type' | 'type' | 'multiple' | 'multiline'>> = {
        text: { interaction_type: 'input', type: 'text', multiple: false, multiline: false },
        'long-text': { interaction_type: 'input', type: 'text', multiple: false, multiline: true },
        number: { interaction_type: 'input', type: 'number', multiple: false, multiline: false },
        date: { interaction_type: 'input', type: 'date', multiple: false, multiline: false },
        file: { interaction_type: 'input', type: 'file', multiple: false, multiline: false },
        'number-range': { interaction_type: 'range', type: 'number', multiple: false, multiline: false },
        'date-range': { interaction_type: 'range', type: 'date', multiple: false, multiline: false },
        single: { interaction_type: 'options', type: 'text', multiple: false, multiline: false },
        multiple: { interaction_type: 'options', type: 'text', multiple: true, multiline: false },
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
