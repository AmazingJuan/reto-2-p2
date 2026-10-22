import { scrollIntoViewSoftly } from '@/lib/scroll';
import { router } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { pathAnswers } from './answers';
import { ConditionStepper } from './condition-stepper';
import { ContactFields, validateContact, type ContactErrors } from './contact-fields';
import { LineList } from './line-list';
import { ProfessionalChoice } from './professional-choice';
import { RequestSheet } from './request-sheet';
import { ServiceRows } from './service-rows';
import type { Answer, ContactData, PickedService, ProfessionalOption, QuoteViewData } from './types';
import { WizardSteps } from './wizard-steps';

const EMPTY_CONTACT: ContactData = { name: '', company: '', role: '', email: '', phone: '' };

const isNarrow = () => window.matchMedia('(max-width: 1023px)').matches;

export function QuotationWizard({ viewData }: { viewData: QuoteViewData }) {
    const [line, setLine] = useState<string | null>(viewData.gestionLines.length === 1 ? viewData.gestionLines[0] : null);
    const [picked, setPicked] = useState<PickedService[]>([]);
    const [path, setPath] = useState<number[]>(viewData.initial_condition_id ? [viewData.initial_condition_id] : []);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [finished, setFinished] = useState(false);
    const [professionalId, setProfessionalId] = useState<number | null>(null);
    const [contact, setContact] = useState(EMPTY_CONTACT);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [contactErrors, setContactErrors] = useState<ContactErrors>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const servicesRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const counts = useMemo(() => Object.fromEntries(viewData.gestionLines.map((name) => [name, viewData.services[name]?.length ?? 0])), [viewData]);
    const readableAnswers = useMemo(
        () => pathAnswers(viewData.conditions, finished ? path : path.slice(0, -1), answers),
        [viewData.conditions, path, answers, finished],
    );

    // Lines in the order the client first picked from them.
    const pickedLines = useMemo(() => [...new Set(picked.map((p) => p.line))], [picked]);
    const pickedCount = useMemo(
        () => Object.fromEntries(pickedLines.map((l) => [l, picked.filter((p) => p.line === l).length])),
        [picked, pickedLines],
    );
    const services = picked.map((p) => p.service);

    // Anyone working in at least one of the picked lines, least experienced first.
    const professionals = useMemo(() => {
        const byId = new Map<number, ProfessionalOption>();
        for (const l of pickedLines) for (const p of viewData.professionalsByGestionLine[l] ?? []) byId.set(p.id, p);
        return [...byId.values()].sort((a, b) => a.years_experience - b.years_experience || a.id - b.id);
    }, [pickedLines, viewData.professionalsByGestionLine]);

    // Drop a preferred professional who no longer fits the picked lines.
    useEffect(() => {
        if (professionalId !== null && !professionals.some((p) => p.id === professionalId)) setProfessionalId(null);
    }, [professionals, professionalId]);

    const step = picked.length === 0 ? 1 : finished ? 3 : 2;

    const chooseLine = (next: string) => {
        setLine(next);
        if (isNarrow()) requestAnimationFrame(() => scrollIntoViewSoftly(servicesRef.current));
    };

    const toggleService = (service: string) => {
        if (!line) return;
        setPicked((current) =>
            current.some((p) => p.service === service) ? current.filter((p) => p.service !== service) : [...current, { line, service }],
        );
    };

    const finishQuestions = () => {
        setFinished(true);
        requestAnimationFrame(() => scrollIntoViewSoftly(contactRef.current));
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (processing) return;

        const errors = validateContact(contact, privacyAccepted);
        setContactErrors(errors);
        setFormErrors([]);
        if (Object.keys(errors).length > 0) return;

        router.post(
            route('quotation.store.proposal'),
            {
                contact,
                businessUnit: viewData.businessUnit,
                gestionLines: pickedLines,
                services,
                answers: pathAnswers(viewData.conditions, path, answers),
                professional_id: professionalId,
                privacy_accepted: privacyAccepted,
            },
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (serverErrors) => {
                    const fieldErrors: ContactErrors = {};
                    const others: string[] = [];
                    for (const [key, message] of Object.entries(serverErrors)) {
                        if (key.startsWith('contact.')) fieldErrors[key.slice('contact.'.length) as keyof ContactData] = message;
                        else if (key === 'privacy_accepted') fieldErrors.privacy_accepted = message;
                        else others.push(message);
                    }
                    setContactErrors(fieldErrors);
                    setFormErrors(others);
                },
            },
        );
    };

    return (
        <>
            <WizardSteps current={step} />

            <section className="frame grid gap-10 py-10 lg:grid-cols-12 lg:gap-x-8 lg:py-14" aria-label="Servicios">
                <div className="lg:col-span-4">
                    <LineList lines={viewData.gestionLines} counts={counts} picked={pickedCount} selected={line} onSelect={chooseLine} />
                </div>
                <div ref={servicesRef} className="scroll-mt-24 lg:col-span-8">
                    <ServiceRows
                        line={line}
                        services={line ? (viewData.services[line] ?? []) : []}
                        selected={picked.filter((p) => p.line === line).map((p) => p.service)}
                        onToggle={toggleService}
                    />
                </div>
            </section>

            {picked.length > 0 && (
                <section className="bg-nube py-12 lg:py-16" aria-label="Preguntas y datos de contacto">
                    <div className="frame grid items-start gap-10 lg:grid-cols-12 lg:gap-x-8">
                        <div className="min-w-0 space-y-12 lg:col-span-7">
                            <div>
                                <h2 className="subheading text-azul">Preguntas sobre su organización</h2>
                                <p className="mt-2 max-w-measure text-pizarra">
                                    Nos ayudan a dimensionar la propuesta. Son pocas y puede volver atrás.
                                </p>
                                <div className="mt-6">
                                    {finished ? (
                                        <div className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                            <p className="flex items-center gap-3 font-display font-bold">
                                                <CheckCircle2 className="h-6 w-6 text-azul" aria-hidden />
                                                Respondió {Object.keys(readableAnswers).length} preguntas
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setFinished(false)}
                                                className="link self-start text-base sm:self-auto"
                                            >
                                                Revisar respuestas
                                            </button>
                                        </div>
                                    ) : (
                                        <ConditionStepper
                                            conditions={viewData.conditions}
                                            path={path}
                                            answers={answers}
                                            onAnswer={(id, answer) => setAnswers((current) => ({ ...current, [id]: answer }))}
                                            onNext={(id) => setPath((current) => [...current, id])}
                                            onBack={() => setPath((current) => current.slice(0, -1))}
                                            onFinish={finishQuestions}
                                        />
                                    )}
                                </div>
                            </div>

                            {finished && (
                                <div ref={contactRef} className="scroll-mt-24">
                                    <h2 className="subheading text-azul">Sus datos</h2>
                                    <p className="mt-2 max-w-measure text-pizarra">Para enviarle la propuesta y resolver dudas sobre su solicitud.</p>
                                    <form onSubmit={submit} noValidate className="panel mt-6 space-y-8 p-5 sm:p-8">
                                        {professionals.length > 0 && (
                                            <ProfessionalChoice
                                                professionals={professionals}
                                                selectedId={professionalId}
                                                onChange={setProfessionalId}
                                            />
                                        )}

                                        <ContactFields
                                            data={contact}
                                            privacyAccepted={privacyAccepted}
                                            errors={contactErrors}
                                            onChange={(field, value) => setContact((current) => ({ ...current, [field]: value }))}
                                            onPrivacyChange={setPrivacyAccepted}
                                        />

                                        {formErrors.length > 0 && (
                                            <ul
                                                role="alert"
                                                className="list-inside list-disc rounded-control border-2 border-error/40 bg-red-50 px-4 py-3 text-base text-error"
                                            >
                                                {formErrors.map((message) => (
                                                    <li key={message}>{message}</li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="flex flex-col gap-4 border-t border-linea pt-6 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="hint">Recibirá una confirmación en su correo.</p>
                                            <button type="submit" disabled={processing} className="btn btn-primary">
                                                {processing ? 'Enviando solicitud…' : 'Enviar solicitud'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        <div className="lg:sticky lg:top-28 lg:col-span-5">
                            <RequestSheet
                                businessUnit={viewData.businessUnit}
                                picked={picked}
                                answers={readableAnswers}
                                professionalId={professionalId}
                            />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
