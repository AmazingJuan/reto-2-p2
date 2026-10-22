import { Modal } from '@/components/ui/modal';
import { pathAnswers } from '@/features/quotation-wizard/answers';
import { ConditionStepper } from '@/features/quotation-wizard/condition-stepper';
import type { Answer, PublicCondition } from '@/features/quotation-wizard/types';
import { useMemo, useState } from 'react';
import type { TreeData } from './types';

type TestRunProps = { tree: TreeData; open: boolean; onOpenChange: (open: boolean) => void };

/** Walk the unsaved questionnaire exactly as the client will, with the same component. */
export function TestRun({ tree, open, onOpenChange }: TestRunProps) {
    const conditions = useMemo(() => Object.fromEntries(tree.conditions.map((c) => [c.id, c as PublicCondition])), [tree]);
    const start = tree.initial_condition_id;
    const [path, setPath] = useState<number[]>(start ? [start] : []);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [done, setDone] = useState(false);

    const restart = () => {
        setPath(start ? [start] : []);
        setAnswers({});
        setDone(false);
    };

    const change = (next: boolean) => {
        if (next) restart();
        onOpenChange(next);
    };

    return (
        <Modal
            open={open}
            onOpenChange={change}
            title={`Prueba: ${tree.name}`}
            description="Así verá el cliente estas preguntas. Nada de lo que responda aquí se guarda."
            className="max-w-2xl"
        >
            {!start ? (
                <p className="text-pizarra">Esta unidad aún no tiene preguntas.</p>
            ) : done ? (
                <div className="space-y-5">
                    <p className="font-display text-lg font-bold text-azul">Fin del cuestionario</p>
                    <dl className="divide-y divide-linea rounded-control border-2 border-linea">
                        {Object.entries(pathAnswers(conditions, path, answers)).map(([question, answer]) => (
                            <div key={question} className="px-4 py-3">
                                <dt className="text-sm text-pizarra">{question}</dt>
                                <dd className="font-semibold">{answer}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="hint">Así quedarán las respuestas en la cotización.</p>
                    <button type="button" onClick={restart} className="btn btn-outline btn-sm">
                        Probar otra vez
                    </button>
                </div>
            ) : (
                <ConditionStepper
                    conditions={conditions}
                    path={path}
                    answers={answers}
                    onAnswer={(id, answer) => setAnswers((current) => ({ ...current, [id]: answer }))}
                    onNext={(id) => setPath((current) => [...current, id])}
                    onBack={() => setPath((current) => current.slice(0, -1))}
                    onFinish={() => setDone(true)}
                />
            )}
        </Modal>
    );
}
