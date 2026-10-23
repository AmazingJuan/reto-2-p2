import { corporate } from '@/components/public/links';
import { scrollIntoViewSoftly } from '@/lib/scroll';
import type { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { answerError, pathAnswers, visibleFields, type VisibleField } from './answers';
import { fieldAnchor } from './condition-field';
import { ContactFields, PrivacyConsent, validateContact, type ContactErrors } from './contact-fields';
import { draft, treeSignature } from './draft';
import { BlockFields, encuadreBlocks, paginate } from './encuadre-form';
import { ErrorSummary, Notice, type SummaryItem } from './notice';
import { ChannelsPanel, StepList, type Screen } from './step-nav';
import type { Answer, ContactData, PublicCondition, QuoteViewData } from './types';

const EMPTY_CONTACT: ContactData = { name: '', company: '', nit: '', economic_activity: '', address: '', role: '', email: '', phone: '' };

const PRIVACY_ERROR = 'Autorice el tratamiento de sus datos para enviar la solicitud.';

/** Problems of some encuadre fields, by question id. */
function encuadreProblems(conditions: Record<string, PublicCondition>, fields: VisibleField[], answers: Record<number, Answer>) {
    const errors: Record<number, string> = {};
    for (const { id } of fields) {
        const error = answerError(conditions[id], answers[id]);
        if (error) errors[id] = error;
    }
    return errors;
}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** How a screen is named: "Identificación de la necesidad, parte 2 de 3". */
const screenName = (screen: Screen) => (screen.parts > 1 ? `${screen.title}, parte ${screen.part} de ${screen.parts}` : screen.title);

/** Where a pager button goes; within the same block the part is enough ("Parte 2 de 3"). */
const pagerName = (to: Screen, from: Screen) => (to.group === from.group ? `Parte ${to.part} de ${to.parts}` : to.title);

/**
 * The quotation request: the "formato de encuadre" one screen at a time,
 * built with the corporate site's own tools. The step list works like the
 * service explorer's line list, the pager names where each button goes, an
 * error summary takes the focus and links to every field, the request is kept
 * in this browser while it is filled in, and the page itself confirms it.
 */
export function QuotationWizard({ viewData }: { viewData: QuoteViewData }) {
    const { conditions, initial_condition_id: initialId, unit } = viewData;
    const { company, flash } = usePage<PageProps>().props;
    const signature = useMemo(() => treeSignature(conditions), [conditions]);
    const [saved] = useState(() => draft.answers(unit, signature));

    const [contact, setContact] = useState<ContactData>(() => ({ ...EMPTY_CONTACT, ...draft.contact() }));
    const [answers, setAnswers] = useState<Record<number, Answer>>(saved?.answers ?? {});
    const [current, setCurrent] = useState(saved?.step ?? 0);
    const [reached, setReached] = useState(saved?.reached ?? 0);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [web, setWeb] = useState(''); // honeypot
    const [showErrors, setShowErrors] = useState(false);
    const [serverErrors, setServerErrors] = useState<ContactErrors>({});
    const [failure, setFailure] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    const panelRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const doneRef = useRef<HTMLDivElement>(null);
    const moved = useRef(false);

    const sent = flash.quotation_sent ?? null;

    const fields = useMemo(() => visibleFields(conditions, initialId, answers), [conditions, initialId, answers]);
    // Long blocks are split in parts that fit on screen.
    const pages = useMemo(() => encuadreBlocks(conditions, fields).flatMap((b) => paginate(conditions, b)), [conditions, fields]);
    const answered = useMemo(
        () =>
            pathAnswers(
                conditions,
                fields.map((f) => f.id),
                answers,
            ),
        [conditions, fields, answers],
    );

    const steps: Screen[] = [
        {
            id: 'datos',
            group: 'datos',
            title: 'Datos del cliente',
            short: 'Datos',
            hint: 'Datos de la empresa y de la persona de contacto.',
            part: 1,
            parts: 1,
        },
        ...pages.map((p) => ({
            id: `bloque-${p.key}-${p.part}`,
            group: p.key,
            title: p.title,
            short: p.short,
            hint: p.hint,
            part: p.part,
            parts: p.parts,
        })),
        {
            id: 'envio',
            group: 'envio',
            title: 'Envío de la solicitud',
            short: 'Envío',
            hint: 'Revise sus respuestas y envíe la solicitud.',
            part: 1,
            parts: 1,
        },
    ];
    const last = steps.length - 1;
    const step = Math.min(current, last);
    const screen = steps[step];
    const page = step > 0 && step < last ? pages[step - 1] : null;

    /** What keeps a screen from going on. The authorization is asked in the last one. */
    const contactProblemsOf = (index: number): ContactErrors => {
        if (index === 0) return validateContact(contact, true);
        if (index === last && !privacyAccepted) return { privacy_accepted: PRIVACY_ERROR };
        return {};
    };
    const fieldProblemsOf = (index: number) => (index > 0 && index < last ? encuadreProblems(conditions, pages[index - 1].fields, answers) : {});
    const isComplete = (index: number) => Object.keys(contactProblemsOf(index)).length + Object.keys(fieldProblemsOf(index)).length === 0;

    const contactErrors: ContactErrors = { ...serverErrors, ...(showErrors ? contactProblemsOf(step) : {}) };
    const fieldErrors = showErrors ? fieldProblemsOf(step) : {};
    const summary: SummaryItem[] = [
        ...Object.entries(contactErrors).map(([key, text]) => ({
            target: key === 'privacy_accepted' ? 'privacy' : `contact-${key}`,
            text: String(text),
        })),
        ...Object.entries(fieldErrors).map(([id, text]) => ({
            target: fieldAnchor(Number(id)),
            text: `${conditions[id].label}: ${lowerFirst(text)}`,
        })),
    ];

    // Blocks whose screens were all reached and are complete: their marker becomes a check.
    const complete = new Set(
        steps.map((s) => s.group).filter((group) => steps.every((s, i) => s.group !== group || (i <= reached && isComplete(i)))),
    );

    // Keep the request in this browser while it is filled in.
    useEffect(() => draft.saveContact(contact), [contact]);
    useEffect(() => {
        if (!sent) draft.saveAnswers(unit, { signature, answers, step, reached });
    }, [unit, signature, answers, step, reached, sent]);

    // Sent: the draft goes away (the contact data stays for the next request) and the confirmation takes the focus.
    useEffect(() => {
        if (!sent) return;
        draft.clearAnswers(unit);
        window.scrollTo({ top: 0 });
        doneRef.current?.focus({ preventScroll: true });
    }, [sent, unit]);

    // After changing screen: back to the top of the panel when it is out of view, focus on its title.
    useEffect(() => {
        if (!moved.current) return;
        moved.current = false;
        if ((panelRef.current?.getBoundingClientRect().top ?? 0) < 0) scrollIntoViewSoftly(panelRef.current);
        titleRef.current?.focus({ preventScroll: true });
        setAnnouncement(`Paso ${step + 1} de ${steps.length}: ${screenName(screen)}.`);
    }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

    const go = (index: number, withErrors = false) => {
        moved.current = true;
        setCurrent(index);
        setReached((r) => Math.max(r, index));
        setShowErrors(withErrors);
    };

    const focusSummary = () => requestAnimationFrame(() => summaryRef.current?.querySelector<HTMLElement>('[tabindex="-1"]')?.focus());

    const next = () => {
        if (!isComplete(step)) {
            setShowErrors(true);
            focusSummary();
            return;
        }
        go(step + 1);
    };

    const submit = (isRetry = false) => {
        // An earlier answer may have opened new fields: send only when every screen is complete.
        const pending = steps.findIndex((_, index) => !isComplete(index));
        if (pending !== -1) {
            if (pending === step) setShowErrors(true);
            else go(pending, true);
            focusSummary();
            return;
        }

        setServerErrors({});
        setFailure([]);

        // A request left open (or kept as a draft) longer than the session gets "Page expired"
        // (419). Instead of Laravel's page, renew the session in the background and send again
        // once; the answers never leave the form.
        let expired = false;
        const stopWatching = router.on('invalid', (event) => {
            if (event.detail.response.status !== 419) return;
            event.preventDefault();
            expired = true;
        });

        router.post(
            route('quotation.store.proposal'),
            { contact, businessUnit: viewData.businessUnit, answers: answered, privacy_accepted: privacyAccepted, web },
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    stopWatching();
                    if (!expired) return setProcessing(false);
                    if (!isRetry) return router.reload({ onSuccess: () => submit(true), onError: () => setProcessing(false) });
                    setProcessing(false);
                    setFailure(['Su sesión expiró y no se pudo renovar. Recargue la página y vuelva a enviar: sus respuestas se conservan.']);
                    focusSummary();
                },
                onError: (errors) => {
                    const fromServer: ContactErrors = {};
                    const others: string[] = [];
                    for (const [key, message] of Object.entries(errors)) {
                        if (key.startsWith('contact.')) fromServer[key.slice('contact.'.length) as keyof ContactData] = message;
                        else if (key === 'privacy_accepted') fromServer.privacy_accepted = message;
                        else others.push(message);
                    }
                    setServerErrors(fromServer);
                    setFailure(others);
                    if (Object.keys(fromServer).some((k) => k !== 'privacy_accepted')) go(0, true);
                    focusSummary();
                },
            },
        );
    };

    const startOver = () => {
        if (!window.confirm('¿Borrar las respuestas de esta solicitud y empezar de nuevo? Sus datos de contacto se conservan.')) return;
        draft.clearAnswers(unit);
        setAnswers({});
        setPrivacyAccepted(false);
        setReached(0);
        go(0);
    };

    if (sent) {
        return (
            <section className="frame pb-[clamp(4rem,2.4rem+6.5vw,9rem)] pt-8 lg:pt-12" aria-label="Solicitud enviada">
                <div className="grid max-w-[46rem] gap-8">
                    <Notice ref={doneRef} tone="ok" role="status" title="Solicitud enviada">
                        <p>
                            Le enviaremos la propuesta a {sent.email}
                            {sent.code && (
                                <>
                                    . El número de su solicitud es <strong className="whitespace-nowrap">{sent.code}</strong>
                                </>
                            )}
                            .{company.phone && <> Si es urgente, llámenos al {company.phone}.</>}
                        </p>
                    </Notice>
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                        <Link href={route('quotation.select.business_unit')} className="btn btn-outline">
                            Solicitar otra cotización
                        </Link>
                        <a href={corporate.home} className="link">
                            Volver al sitio de Training Corporation
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="frame grid items-start gap-x-8 gap-y-6 pb-[clamp(4rem,2.4rem+6.5vw,9rem)] pt-5 lg:grid-cols-12 lg:pt-10">
            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>

            <div className="grid gap-8 lg:sticky lg:top-[11rem] lg:col-span-4">
                <StepList steps={steps} current={step} reached={reached} complete={complete} onGo={(index: number) => go(index)} />
                <ChannelsPanel className="hidden lg:block" />
            </div>

            <section ref={panelRef} aria-labelledby="paso-titulo" className="min-w-0 scroll-mt-[9.5rem] lg:col-span-8 lg:scroll-mt-[11rem]">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (step === last) submit();
                        else next();
                    }}
                    noValidate
                >
                    <header className="mb-8">
                        <h2 id="paso-titulo" ref={titleRef} tabIndex={-1} className="subheading text-azul outline-none">
                            {screen.title}
                        </h2>
                        <p className="mt-2 font-semibold text-pizarra">
                            {screen.hint}
                            {screen.parts > 1 && ` Parte ${screen.part} de ${screen.parts}.`}
                        </p>
                    </header>

                    <div className="grid gap-7">
                        <div ref={summaryRef} className="empty:hidden">
                            {summary.length > 0 && <ErrorSummary items={summary} action={step === last ? 'enviar' : 'continuar'} />}
                            {summary.length === 0 && failure.length > 0 && (
                                <Notice tone="error" role="alert" title="La solicitud no se pudo enviar">
                                    <ul className="list-disc pl-5">
                                        {failure.map((message) => (
                                            <li key={message}>{message}</li>
                                        ))}
                                    </ul>
                                    <p className="mt-2">
                                        {company.email && (
                                            <>
                                                Escríbanos a{' '}
                                                <a href={`mailto:${company.email}`} className="font-semibold text-error underline">
                                                    {company.email}
                                                </a>
                                            </>
                                        )}
                                        {company.email && company.phone && ' o '}
                                        {company.phone && <>llame al {company.phone}</>}. Sus respuestas siguen en el formulario.
                                    </p>
                                </Notice>
                            )}
                        </div>

                        {step === 0 && (
                            <ContactFields
                                data={contact}
                                errors={contactErrors}
                                onChange={(field, value) => setContact((c) => ({ ...c, [field]: value }))}
                            />
                        )}

                        {page && (
                            <BlockFields
                                fields={page.fields}
                                conditions={conditions}
                                answers={answers}
                                onAnswer={(id, answer) => setAnswers((a) => ({ ...a, [id]: answer }))}
                                errors={fieldErrors}
                            />
                        )}

                        {step === last && (
                            <>
                                <details className="group rounded-[10px] border-2 border-linea">
                                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-display font-bold text-azul [&::-webkit-details-marker]:hidden">
                                        Revisar sus respuestas ({Object.keys(answered).length})
                                        <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" aria-hidden />
                                    </summary>
                                    <dl className="max-h-96 overflow-y-auto border-t border-linea px-5">
                                        {Object.entries(answered).map(([question, answer]) => (
                                            <div key={question} className="border-b border-linea py-3 last:border-0">
                                                <dt className="text-sm font-bold text-pizarra">{question}</dt>
                                                <dd className="whitespace-pre-line">{answer}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </details>

                                <div className="absolute -left-[9999px]" aria-hidden>
                                    <label>
                                        No llenar{' '}
                                        <input
                                            type="text"
                                            name="web"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={web}
                                            onChange={(e) => setWeb(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <PrivacyConsent accepted={privacyAccepted} error={contactErrors.privacy_accepted} onChange={setPrivacyAccepted} />
                            </>
                        )}
                    </div>

                    {/* Like the explorer's pager: each button says where it goes. */}
                    <nav aria-label="Pasos" className="mt-10 grid gap-3 sm:grid-cols-2">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => go(step - 1)}
                                className="flex items-center gap-3 rounded-[10px] border-2 border-linea px-5 py-4 text-left font-display font-bold text-azul transition-colors hover:border-azul"
                            >
                                <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
                                <span>
                                    <span className="block font-sans text-sm font-semibold text-pizarra">Anterior</span>
                                    {pagerName(steps[step - 1], screen)}
                                </span>
                            </button>
                        )}
                        {step < last ? (
                            <button
                                type="submit"
                                className="flex items-center justify-between gap-3 rounded-[10px] border-2 border-azul bg-azul px-5 py-4 text-right font-display font-bold text-white transition-colors hover:border-azul-hondo hover:bg-azul-hondo max-sm:order-first sm:col-start-2"
                            >
                                <span className="ml-auto">
                                    <span className="block font-sans text-sm font-semibold text-white/85">Siguiente</span>
                                    {pagerName(steps[step + 1], screen)}
                                </span>
                                <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary min-h-[4.5rem] text-base max-sm:order-first sm:col-start-2"
                            >
                                {processing ? 'Enviando solicitud…' : 'Enviar solicitud'}
                            </button>
                        )}
                    </nav>

                    <p className="mt-6 text-sm text-pizarra">
                        Sus respuestas se guardan en este navegador mientras completa la solicitud.{' '}
                        {Object.keys(answers).length > 0 && (
                            <button type="button" onClick={startOver} className="link">
                                Empezar de nuevo
                            </button>
                        )}
                    </p>
                </form>
            </section>

            <ChannelsPanel className="lg:hidden" />
        </div>
    );
}
