import type { Answer, ContactData, PublicCondition } from './types';

/**
 * The request is kept in this browser while it is filled in, as the corporate
 * site keeps the visitor's quote list (B2B buyers research over several days).
 * The contact data is shared by every unit; the answers are per unit and are
 * dropped when the questionnaire changed since they were saved.
 */
type SavedAnswers = { signature: string; answers: Record<number, Answer>; step: number; reached: number };

const CONTACT_KEY = 'tc-encuadre:contacto';
const answersKey = (unit: string) => `tc-encuadre:${unit}`;

/** Changes whenever the questions of the unit change (ids are recreated by the seeder). */
export const treeSignature = (conditions: Record<string, PublicCondition>) => Object.keys(conditions).sort().join(',');

function read<T>(key: string): T | null {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

function write(key: string, value: unknown) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Private mode or full storage: the form keeps working, it just isn't kept.
    }
}

function remove(key: string) {
    try {
        window.localStorage.removeItem(key);
    } catch {
        // Nothing to clean up.
    }
}

export const draft = {
    contact: () => read<ContactData>(CONTACT_KEY),
    saveContact: (contact: ContactData) => write(CONTACT_KEY, contact),

    answers(unit: string, signature: string): SavedAnswers | null {
        const saved = read<SavedAnswers>(answersKey(unit));
        return saved && saved.signature === signature ? saved : null;
    },
    saveAnswers: (unit: string, saved: SavedAnswers) => write(answersKey(unit), saved),
    /** Whether a request for this unit was left half done (to offer to continue it). */
    hasAnswers: (unit: string) => Object.keys(read<SavedAnswers>(answersKey(unit))?.answers ?? {}).length > 0,
    clearAnswers: (unit: string) => remove(answersKey(unit)),
};
