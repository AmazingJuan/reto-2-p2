import type { Answer, OptionsAnswer, PublicCondition, RangeAnswer } from './types';

export const emptyAnswer = (condition: PublicCondition): Answer => {
    if (condition.interaction_type === 'range') return { min: '', max: '' };
    if (condition.interaction_type === 'options') return { selected: [], other: '' };
    return '';
};

const otherIndex = (condition: PublicCondition, answer: OptionsAnswer) => answer.selected.find((i) => condition.options[i]?.is_other);

/** Why the answer can't be accepted yet, or null when it is complete. */
export function answerError(condition: PublicCondition, answer: Answer | undefined): string | null {
    const value = answer ?? emptyAnswer(condition);

    switch (condition.interaction_type) {
        case 'input':
            return String(value).trim() === '' ? 'Este campo es obligatorio.' : null;

        case 'range': {
            const { min, max } = value as RangeAnswer;
            if (min.trim() === '' || max.trim() === '') return 'Indique ambos valores.';
            if (condition.type === 'number') {
                const [a, b] = [Number(min), Number(max)];
                if (Number.isNaN(a) || Number.isNaN(b)) return 'Ingrese números válidos.';
                return a < b ? null : 'El valor inicial debe ser menor que el final.';
            }
            if (condition.type === 'date') {
                return new Date(min) < new Date(max) ? null : 'La fecha inicial debe ser anterior a la final.';
            }
            return null;
        }

        case 'options': {
            const options = value as OptionsAnswer;
            if (options.selected.length === 0) return condition.multiple ? 'Seleccione al menos una opción.' : 'Seleccione una opción.';
            if (otherIndex(condition, options) !== undefined && options.other.trim() === '') return 'Escriba su respuesta en «Otro».';
            return null;
        }
    }
}

/** Where the flow goes after this answer: a single-choice option may branch. */
export function nextConditionId(condition: PublicCondition, answer: Answer | undefined): number | null {
    if (condition.interaction_type === 'options' && !condition.multiple && answer) {
        const chosen = condition.options[(answer as OptionsAnswer).selected[0]];
        if (chosen?.next_condition) return chosen.next_condition;
    }
    return condition.next_condition;
}

const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-CO');
};

/** Human-readable answer, as stored in the quotation and shown in the summary. */
export function formatAnswer(condition: PublicCondition, answer: Answer): string {
    switch (condition.interaction_type) {
        case 'input':
            return condition.type === 'date' ? formatDate(String(answer)) : String(answer).trim();

        case 'range': {
            const { min, max } = answer as RangeAnswer;
            const fmt = condition.type === 'date' ? formatDate : (v: string) => v.trim();
            return `Desde ${fmt(min)} hasta ${fmt(max)}`;
        }

        case 'options': {
            const { selected, other } = answer as OptionsAnswer;
            return [...selected]
                .sort((a, b) => Number(condition.options[a]?.is_other) - Number(condition.options[b]?.is_other) || a - b)
                .map((i) => (condition.options[i]?.is_other ? other.trim() : condition.options[i]?.label))
                .filter(Boolean)
                .join(', ');
        }
    }
}

/**
 * Readable answers for the conditions actually walked (in order). Answers of
 * branches the client backed out of are ignored. Repeated labels get a suffix
 * so they don't overwrite each other.
 */
export function pathAnswers(conditions: Record<string, PublicCondition>, path: number[], answers: Record<number, Answer>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const id of path) {
        const condition = conditions[id];
        const answer = answers[id];
        if (!condition || answer === undefined) continue;

        let key = condition.label;
        for (let n = 2; key in result; n++) key = `${condition.label} (${n})`;
        result[key] = formatAnswer(condition, answer);
    }

    return result;
}
