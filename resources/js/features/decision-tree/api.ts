import { router } from '@inertiajs/react';
import type { ConditionData } from './types';

/** Where a new question goes. */
export type Placement = { at_start?: boolean; insert_after?: number; branch_option_id?: number };

type Callbacks = { onSuccess?: () => void; onError?: (errors: Record<string, string>) => void; onFinish?: () => void };

// Every action reloads only the tree data and keeps scroll and local drafts.
const options = ({ onSuccess, onError, onFinish }: Callbacks = {}) => ({
    preserveScroll: true,
    preserveState: true,
    only: ['viewData', 'flash', 'errors'],
    onSuccess: () => onSuccess?.(),
    onError: (errors: Record<string, string>) => onError?.(errors),
    onFinish: () => onFinish?.(),
});

/** Only what the server stores; options are dropped for non-choice questions. */
function payload(question: ConditionData) {
    const isChoice = question.interaction_type === 'options';
    return {
        label: question.label,
        observation: question.observation,
        placeholder: isChoice || question.type === 'file' ? null : question.placeholder,
        multiline: question.multiline,
        interaction_type: question.interaction_type,
        type: question.type,
        multiple: isChoice && question.multiple,
        section: question.section,
        required: question.required,
        next_condition: question.next_condition,
        options: isChoice ? question.options : [],
    };
}

export const treeApi = {
    create: (unitId: number, question: ConditionData, placement: Placement, callbacks?: Callbacks) =>
        router.post(route('dashboard.decision-tree.questions.store', unitId), { ...payload(question), ...placement }, options(callbacks)),

    update: (question: ConditionData, callbacks?: Callbacks) =>
        router.put(route('dashboard.decision-tree.questions.update', question.id), payload(question), options(callbacks)),

    remove: (id: number, callbacks?: Callbacks) => router.delete(route('dashboard.decision-tree.questions.delete', id), options(callbacks)),

    move: (id: number, direction: 'up' | 'down', callbacks?: Callbacks) =>
        router.post(route('dashboard.decision-tree.questions.move', id), { direction }, options(callbacks)),

    copy: (unitId: number, sourceId: number, callbacks?: Callbacks) =>
        router.post(route('dashboard.decision-tree.copy', unitId), { source_id: sourceId }, options(callbacks)),
};
