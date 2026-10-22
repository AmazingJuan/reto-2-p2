import { capitalize } from '@/lib/format';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { PickedService } from './types';

type RequestSheetProps = {
    businessUnit: string;
    picked: PickedService[];
    answers: Record<string, string>;
    professionalId: number | null;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="border-t border-white/25 py-4">
            <dt className="font-display text-sm font-bold">{label}</dt>
            <dd className="mt-1">{children}</dd>
        </div>
    );
}

/** Live summary of the request on a plain blue field, like the corporate contact page. */
export function RequestSheet({ businessUnit, picked, answers, professionalId }: RequestSheetProps) {
    const { company } = usePage<PageProps>().props;
    const answered = Object.entries(answers);
    const lines = [...new Set(picked.map((p) => p.line))];

    return (
        <aside aria-label="Resumen de su solicitud" className="field-azul p-7 sm:p-9">
            <h2 className="subheading">Su solicitud</h2>
            <dl className="mt-5">
                <Row label="Unidad de negocio">{capitalize(businessUnit)}</Row>
                {lines.map((line) => (
                    <Row key={line} label={capitalize(line)}>
                        <ul className="space-y-1">
                            {picked
                                .filter((p) => p.line === line)
                                .map((p) => (
                                    <li key={p.service}>{p.service}</li>
                                ))}
                        </ul>
                    </Row>
                ))}
                {answered.length > 0 && (
                    <Row label="Respuestas">
                        <ul className="space-y-3">
                            {answered.map(([question, answer]) => (
                                <li key={question} className="leading-snug">
                                    <span className="block text-[0.9375rem] opacity-85">{question}</span>
                                    <span className="font-semibold">{answer}</span>
                                </li>
                            ))}
                        </ul>
                    </Row>
                )}
                {professionalId !== null && <Row label="Profesional preferido">Profesional n.º {professionalId}</Row>}
            </dl>
            {company.phone && (
                <p className="mt-2 border-t border-white/25 pt-4 text-base">
                    ¿Prefiere hablar directamente? Llame al{' '}
                    <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`} className="font-bold underline underline-offset-[0.2em]">
                        {company.phone}
                    </a>
                    .
                </p>
            )}
        </aside>
    );
}
