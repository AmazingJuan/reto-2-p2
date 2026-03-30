import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { CheckCircle2, GitBranch, Layers, Loader2, SlidersHorizontal, UserRound } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import GoSelect from '../goselect';
import Header from '../header';
import ServicesByLine from './ServicesByLine';

export interface ViewData {
    businessUnit: string;
    gestionLines: string[];
    services: {
        [gestionLine: string]: string[];
    };
    conditions?: {
        [id: string]: {
            label: string;
            interaction_type: string;
            type: string;
            observation?: string | null;
            next_condition?: number;
        };
    };
    initial_condition_id?: number | null;
}

interface GestionLineProps {
    viewData: ViewData;
}

export default function GestionLine({ viewData }: GestionLineProps) {
    const [selectedLine, setSelectedLine] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [conditionInitialId, setConditionInitialId] = useState<number | null>(viewData.initial_condition_id ?? null);
    const [history, setHistory] = useState<number[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [savedSnapshot, setSavedSnapshot] = useState<any | null>(null);
    const [showProfessionalModal, setShowProfessionalModal] = useState(false);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
    const [professionalList, setProfessionalList] = useState<{ id: number; years_experience: number }[]>([]);
    const [hasAnyProfessionalsInDb, setHasAnyProfessionalsInDb] = useState(false);
    const [loadingProfessionals, setLoadingProfessionals] = useState(false);
    const [professionalFetchError, setProfessionalFetchError] = useState<string | null>(null);
    const [professionalPickerError, setProfessionalPickerError] = useState<string | null>(null);
    const [filterMinYears, setFilterMinYears] = useState('');
    const [filterMaxYears, setFilterMaxYears] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);

    // contact form state (agregado campo 'role')
    const [contact, setContact] = useState({ name: '', company: '', role: '', email: '', phone: '' });
    const [showSavedDetails, setShowSavedDetails] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    // refs for auto-scroll
    const servicesRef = useRef<HTMLDivElement>(null);
    const conditionsRef = useRef<HTMLDivElement>(null);

    const visibleLines = viewData.gestionLines.filter((line) => (viewData.services[line]?.length ?? 0) > 0);

    const fetchProfessionalsList = useCallback(async () => {
        setLoadingProfessionals(true);
        setProfessionalFetchError(null);
        try {
            const url = route('quotation.professionals.list');
            const params = new URLSearchParams();
            if (filterMinYears.trim() !== '') params.set('min_years', filterMinYears.trim());
            if (filterMaxYears.trim() !== '') params.set('max_years', filterMaxYears.trim());
            const qs = params.toString();
            const res = await fetch(qs ? `${url}?${qs}` : url, {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!res.ok) throw new Error('fetch');
            const data = await res.json();
            setProfessionalList(Array.isArray(data.professionals) ? data.professionals : []);
            setHasAnyProfessionalsInDb(Boolean(data.has_any_professionals));
        } catch {
            setProfessionalFetchError('No se pudieron cargar los profesionales. Intente otra vez.');
            setProfessionalList([]);
            setHasAnyProfessionalsInDb(true);
        } finally {
            setLoadingProfessionals(false);
        }
    }, [filterMinYears, filterMaxYears]);

    useEffect(() => {
        if (!showProfessionalModal) return;
        setSelectedProfessionalId(null);
        setProfessionalPickerError(null);
        void fetchProfessionalsList();
        // Solo al abrir el paso; los filtros se aplican con el botón "Aplicar filtros"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showProfessionalModal]);

    const handleContinueFromProfessionalPicker = () => {
        if (professionalList.length > 0 && selectedProfessionalId === null) {
            setProfessionalPickerError('Seleccione un profesional de la lista para continuar.');
            return;
        }
        setProfessionalPickerError(null);
        setShowProfessionalModal(false);
        setShowContactModal(true);
    };

    const handleSkipProfessionalsWhenEmpty = () => {
        setProfessionalPickerError(null);
        setShowProfessionalModal(false);
        setShowContactModal(true);
    };

    // handlers for contact modal
    const handleSendContact = () => {
        // basic validation (inline)
        const errors: Record<string, string[]> = {};
        if (!contact.name.trim()) errors.name = ['Por favor ingresa nombre.'];
        if (!contact.role.trim()) errors.role = ['Por favor ingresa el cargo.'];
        if (!contact.email.trim()) errors.email = ['Por favor ingresa correo.'];
        else {
            const emailOk = /\S+@\S+\.\S+/.test(contact.email);
            if (!emailOk) errors.email = ['Ingresa un correo válido.'];
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        // build payload; include services (could be single or multiple)
        const servicesSelected = savedSnapshot?.selectedServices ?? selectedServices;
        const servicesArray = Array.isArray(servicesSelected) ? servicesSelected : servicesSelected ? [servicesSelected] : [];

        // build readable Answers (same format as the "resumen previo")
        const rawAnswers = savedSnapshot?.snapshot?.answers ?? savedSnapshot?.answers ?? answers;
        const readableAnswers: Record<string, string> = {};
        if (rawAnswers) {
            Object.entries(rawAnswers).forEach(([k, v]) => {
                const cond = viewData.conditions && viewData.conditions[k];
                const condLabel = cond && cond.label ? cond.label : `Condición ${k}`;
                let valueDisplay: string;
                if (cond && cond.interaction_type === 'options') {
                    const opts = Array.isArray((cond as any).options) ? (cond as any).options : [];
                    if (typeof v === 'object' && v !== null && 'optionIndex' in (v as Record<string, unknown>)) {
                        const optionIndex = (v as { optionIndex: number }).optionIndex;
                        const textValue = (v as { text?: string }).text;
                        valueDisplay = textValue && textValue.trim() !== '' ? textValue : opts[optionIndex]?.label || String(optionIndex);
                    } else if (typeof v === 'number' && opts[v]) {
                        valueDisplay = opts[v].label || String(v);
                    } else {
                        valueDisplay = String(v);
                    }
                } else if (cond && cond.interaction_type === 'range') {
                    const isRange =
                        typeof v === 'object' && v !== null && 'min' in (v as Record<string, unknown>) && 'max' in (v as Record<string, unknown>);
                    const min = isRange ? (v as { min: any; max: any }).min : '';
                    const max = isRange ? (v as { min: any; max: any }).max : '';
                    if (cond.type === 'date') {
                        const fmt = (d: any) => {
                            const dt = new Date(d);
                            return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString('es-CO');
                        };
                        valueDisplay = `Desde ${fmt(min)} hasta ${fmt(max)}`;
                    } else {
                        valueDisplay = `Desde ${String(min)} hasta ${String(max)}`;
                    }
                } else {
                    valueDisplay = typeof v === 'object' ? JSON.stringify(v) : String(v);
                }

                readableAnswers[condLabel] = valueDisplay;
            });
        }

        const payload: Record<string, any> = {
            contact,
            businessUnit: viewData.businessUnit,
            gestionLine: savedSnapshot?.selectedLine ?? selectedLine,
            services: servicesArray,
            answers: readableAnswers,
        };
        if (selectedProfessionalId !== null) {
            payload.professional_id = selectedProfessionalId;
        }

        // use Ziggy route helper if available; route name: quotation.store.proposal
        let url = '/cotizar';
        try {
            // @ts-ignore
            if ((window as any).route) url = (window as any).route('quotation.store.proposal');
        } catch (e) {
            // fallback remains
        }

        // send via Inertia router.post
        try {
            router.post(url, payload, {
                onError: (errors: any) => {
                    // show errors inline in the modal
                    // errors is usually an object { field: [messages] }
                    setFormErrors(errors || { _global: ['Error de validación'] });
                },
                onSuccess: () => {
                    setFormErrors({});
                    setShowContactModal(false);
                    setSavedSnapshot(null);
                    setSelectedProfessionalId(null);
                    setContact({ name: '', company: '', role: '', email: '', phone: '' });
                    setShowSavedDetails(false);
                },
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('router.post error', e);
            setFormErrors({ _global: ['Ocurrió un error al enviar. Intenta nuevamente.'] });
        }
    };

    const handleReturnToSnapshot = () => {
        if (!savedSnapshot) return;
        setSelectedLine(savedSnapshot.selectedLine ?? null);
        setSelectedServices(savedSnapshot.selectedServices ?? []);
        setAnswers(savedSnapshot.answers ?? {});
        // restore condition id if available (place user at last condition)
        const restoredId = savedSnapshot.snapshot?.currentId ?? viewData.initial_condition_id ?? null;
        setConditionInitialId(restoredId);
        setShowContactModal(false);
        setShowProfessionalModal(false);
        setShowSavedDetails(false);
        // keep savedSnapshot so the stepper can receive initialHistory from it
    };

    // when user selects a service, initialize the condition stepper id
    React.useEffect(() => {
        if (selectedServices && selectedServices.length >= 1) {
            setConditionInitialId(viewData.initial_condition_id ?? null);
        }
    }, [selectedServices, viewData.initial_condition_id]);

    // smooth scroll helper with easing
    const smoothScrollTo = (element: HTMLElement, duration = 600) => {
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - 100;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime: number | null = null;

        const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        const step = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    // auto-scroll to services when a line is selected
    React.useEffect(() => {
        if (selectedLine && servicesRef.current) {
            const el = servicesRef.current;
            const frameId = requestAnimationFrame(() => smoothScrollTo(el, 500));
            return () => cancelAnimationFrame(frameId);
        }
    }, [selectedLine]);

    // auto-scroll to conditions when a service is selected
    React.useEffect(() => {
        if (selectedServices.length > 0 && conditionsRef.current) {
            const el = conditionsRef.current;
            const frameId = requestAnimationFrame(() => smoothScrollTo(el, 500));
            return () => cancelAnimationFrame(frameId);
        }
    }, [selectedServices]);

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="pointer-events-none fixed -right-32 -top-32 h-80 w-80 rounded-full bg-[#0693e3]/12 blur-3xl sm:h-96 sm:w-96" aria-hidden />
            <div
                className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96"
                style={{ animationDelay: '-4s' }}
                aria-hidden
            />

            <Header />

            <main className="container mx-auto flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
                <div className="mb-8">
                    <GoSelect />
                </div>

                <div className="mb-12 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0693e3]/25 to-emerald-500/20 shadow-lg shadow-[#0693e3]/10 sm:h-[4.5rem] sm:w-[4.5rem]">
                        <GitBranch className="h-8 w-8 text-[#0693e3] sm:h-9 sm:w-9" strokeWidth={2} />
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0693e3]/90">Unidad de negocio</p>
                    <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
                        <span className="text-gradient">{capitalize(viewData.businessUnit)}</span>
                    </h2>

                    <p className="mx-auto max-w-lg text-slate-600">Selecciona una línea de gestión para ver sus servicios</p>
                </div>

                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleLines.length === 0 && (
                        <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center text-slate-600">
                            No hay líneas de gestión con servicios disponibles para esta unidad.
                        </p>
                    )}
                    {visibleLines.map((line, index) => {
                        const isSelected = selectedLine === line;
                        const staggerClass = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5'][Math.min(index, 4)];

                        return (
                            <Card
                                key={line}
                                onClick={() => {
                                    setSelectedLine(line);
                                    setSelectedServices([]);
                                }}
                                className={`card-shine hover-lift group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 animate-slide-up ${staggerClass} ${
                                    isSelected
                                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-lg shadow-emerald-500/20'
                                        : 'border-slate-200 bg-white hover:border-[#0693e3]/50 hover:shadow-lg'
                                }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                                                isSelected
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                    : 'bg-slate-100 text-slate-600 group-hover:bg-[#0693e3]/10 group-hover:text-[#0693e3]'
                                            }`}
                                        >
                                            <Layers className="h-6 w-6" />
                                        </div>

                                        <div className="min-w-0 flex-1 text-left">
                                            <h3 className="text-lg font-semibold text-slate-900">{capitalize(line)}</h3>
                                        </div>

                                        {isSelected && <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" aria-hidden />}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {selectedLine && (
                    <div ref={servicesRef} className="animate-fade-in scroll-mt-28">
                        <ServicesByLine
                            line={selectedLine}
                            services={viewData.services[selectedLine]}
                            selected={selectedServices}
                            onToggle={(s) => {
                                setSelectedServices((prev) => {
                                    if (prev.includes(s)) return prev.filter((x) => x !== s);
                                    return [...prev, s];
                                });
                            }}
                        />
                    </div>
                )}

                {/* Condiciones para el servicio seleccionado (si vienen en viewData) */}
                {/** show conditions when at least one service is selected */}
                {(() => {
                    if (!selectedServices || selectedServices.length === 0) return null;

                    return (
                        <div ref={conditionsRef} className="mt-12 scroll-mt-28">
                            <h3 className="mb-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
                                Condiciones para{' '}
                                {selectedServices.length === 1 ? selectedServices[0] : `${selectedServices.length} servicios seleccionados`}
                            </h3>
                            <p className="mb-8 text-center text-slate-600">Responde las condiciones una a una</p>

                            {!viewData.conditions || Object.keys(viewData.conditions).length === 0 ? (
                                <p className="text-center text-slate-500">No hay condiciones disponibles para este servicio.</p>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <ConditionStepper
                                        conditions={viewData.conditions}
                                        initialConditionId={conditionInitialId}
                                        initialHistory={savedSnapshot?.snapshot?.history}
                                        answers={answers}
                                        onAnswer={(cid, value) => setAnswers((prev) => ({ ...prev, [cid]: value }))}
                                        onComplete={(snapshot) => {
                                            // save snapshot (including selected line/services and answers/history)
                                            setSavedSnapshot({
                                                selectedLine,
                                                selectedServices,
                                                answers,
                                                snapshot,
                                            });

                                            // elegir profesional (anonimizado) antes del formulario de contacto
                                            setShowProfessionalModal(true);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })()}
            </main>

            {/* Elegir profesional (solo ID + años de experiencia para el usuario) */}
            {showProfessionalModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                        aria-label="Cerrar"
                        onClick={() => setShowProfessionalModal(false)}
                    />
                    <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 sm:max-w-2xl sm:p-8">
                        <div className="mb-6 flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0693e3]/25 to-[#0693e3]/5 text-[#047ac0]">
                                <UserRound className="h-6 w-6" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Elija un profesional</h3>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                    Por privacidad mostramos solo un identificador y los años de experiencia. Después podrá enviar sus datos de contacto.
                                </p>
                            </div>
                        </div>

                        <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/90 p-4">
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Filtrar por años de experiencia
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Mínimo</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={80}
                                        value={filterMinYears}
                                        onChange={(e) => setFilterMinYears(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                        placeholder="Ej. 3"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Máximo</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={80}
                                        value={filterMaxYears}
                                        onChange={(e) => setFilterMaxYears(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                        placeholder="Ej. 15"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => void fetchProfessionalsList()}
                                    disabled={loadingProfessionals}
                                    className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                                >
                                    Aplicar filtros
                                </button>
                            </div>
                        </div>

                        {professionalFetchError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{professionalFetchError}</div>
                        )}
                        {professionalPickerError && (
                            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{professionalPickerError}</div>
                        )}

                        {loadingProfessionals ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-600">
                                <Loader2 className="h-8 w-8 animate-spin text-[#0693e3]" />
                                <p className="text-sm">Cargando opciones…</p>
                            </div>
                        ) : professionalList.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center">
                                {hasAnyProfessionalsInDb ? (
                                    <>
                                        <p className="text-sm font-medium text-slate-700">Ningún profesional coincide con el filtro de experiencia.</p>
                                        <p className="mt-1 text-xs text-slate-500">Amplíe el rango o borre mínimo y máximo y pulse Aplicar filtros.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-slate-700">Aún no hay profesionales registrados en el sistema.</p>
                                        <p className="mt-1 text-xs text-slate-500">Puede continuar; su solicitud se registrará sin asignación de profesional.</p>
                                        <button
                                            type="button"
                                            onClick={handleSkipProfessionalsWhenEmpty}
                                            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0693e3] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0693e3]/25 transition hover:bg-[#047ac0]"
                                        >
                                            Continuar con datos de contacto
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <ul className="grid max-h-[min(40vh,22rem)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                                {professionalList.map((p) => {
                                    const selected = selectedProfessionalId === p.id;
                                    return (
                                        <li key={p.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedProfessionalId(p.id);
                                                    setProfessionalPickerError(null);
                                                }}
                                                className={`flex w-full flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition ${
                                                    selected
                                                        ? 'border-[#0693e3] bg-[#0693e3]/5 ring-2 ring-[#0693e3]/20'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                                                }`}
                                            >
                                                <span className="text-sm font-bold text-slate-900">Profesional #{p.id}</span>
                                                <span className="mt-1 text-xs text-slate-600">
                                                    {p.years_experience} {p.years_experience === 1 ? 'año' : 'años'} de experiencia
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:gap-3">
                            <button
                                type="button"
                                onClick={handleReturnToSnapshot}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                                Volver a condiciones
                            </button>
                            {professionalList.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={handleContinueFromProfessionalPicker}
                                    className="rounded-xl bg-gradient-to-b from-[#0693e3] to-[#0580c7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0693e3]/30 transition hover:from-[#0588d4] hover:to-[#0470b0] disabled:cursor-not-allowed disabled:opacity-40"
                                    disabled={selectedProfessionalId === null}
                                >
                                    Continuar con datos de contacto
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact modal shown after finalizar */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        aria-label="Cerrar"
                        onClick={() => setShowContactModal(false)}
                    />

                    <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8">
                        <h3 className="mb-2 text-xl font-bold text-slate-900">Casi listo — déjanos tus datos</h3>
                        <p className="mb-6 text-sm text-slate-600">Ingresa tus datos para que podamos contactarte sobre esta cotización.</p>

                        {(() => {
                            const fieldKeys = ['name', 'company', 'role', 'email', 'phone', 'professional_id'];
                            const globalMsgs: string[] = formErrors._global ? [...formErrors._global] : [];
                            const otherMsgs: string[] = Object.entries(formErrors)
                                .filter(([k]) => k !== '_global' && !fieldKeys.includes(k))
                                .flatMap(([, msgs]) => msgs as string[]);
                            const topMsgs = [...globalMsgs, ...otherMsgs];
                            if (topMsgs.length === 0) return null;

                            return (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                                    <ul className="list-inside list-disc space-y-0.5">
                                        {topMsgs.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="col-span-2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
                                <input
                                    value={contact.name}
                                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                    placeholder="Tu nombre"
                                />
                                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
                                <input
                                    value={contact.company}
                                    onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                    placeholder="Nombre de la empresa (opcional)"
                                />
                                {formErrors.company && <p className="mt-1 text-sm text-red-600">{formErrors.company[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Cargo</label>
                                <input
                                    value={contact.role}
                                    onChange={(e) => setContact((c) => ({ ...c, role: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                    placeholder="Cargo o puesto en la empresa"
                                />
                                {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
                                <input
                                    value={contact.email}
                                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                    placeholder="correo@ejemplo.com"
                                />
                                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                                <input
                                    value={contact.phone}
                                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
                                    placeholder="+57 300 123 4567"
                                />
                                {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleSendContact}
                                    className="rounded-xl bg-gradient-to-b from-[#0693e3] to-[#0580c7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0693e3]/25 transition hover:from-[#0588d4] hover:to-[#0470b0]"
                                >
                                    Enviar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReturnToSnapshot}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    Volver
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSavedDetails((v) => !v)}
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-[#0693e3] hover:text-[#047ac0]"
                                >
                                    {showSavedDetails ? 'Ocultar resumen' : 'Visualizar el resumen de la propuesta'}
                                </button>
                            </div>
                        </div>

                        {showSavedDetails && savedSnapshot && (
                            <div className="mt-4 max-h-52 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                                <h4 className="mb-3 font-semibold text-slate-900">Resumen previo</h4>
                                <p className="text-sm text-slate-700">
                                    <strong>Línea de Gestión:</strong> {savedSnapshot.selectedLine || '-'}{' '}
                                </p>
                                <p className="text-sm text-slate-700">
                                    <strong>Servicio(s):</strong>{' '}
                                    {Array.isArray(savedSnapshot.selectedServices) && savedSnapshot.selectedServices.length > 0
                                        ? savedSnapshot.selectedServices.join(', ')
                                        : '-'}{' '}
                                </p>
                                <div className="mt-2 text-sm">
                                    <strong>Respuestas:</strong>
                                    <ul className="mt-1 list-inside list-disc text-slate-700">
                                        {savedSnapshot.snapshot && savedSnapshot.snapshot.answers ? (
                                            Object.entries(savedSnapshot.snapshot.answers).map(([k, v]) => {
                                                const cond = viewData.conditions && viewData.conditions[k];
                                                const condLabel = cond && cond.label ? cond.label : `Condición ${k}`;
                                                let valueDisplay: string;
                                                if (cond && cond.interaction_type === 'options') {
                                                    const opts = Array.isArray((cond as any).options) ? (cond as any).options : [];
                                                    if (typeof v === 'object' && v !== null && 'optionIndex' in (v as Record<string, unknown>)) {
                                                        const optionIndex = (v as { optionIndex: number }).optionIndex;
                                                        const textValue = (v as { text?: string }).text;
                                                        valueDisplay =
                                                            textValue && textValue.trim() !== ''
                                                                ? textValue
                                                                : opts[optionIndex]?.label || String(optionIndex);
                                                    } else if (typeof v === 'number' && opts[v]) {
                                                        valueDisplay = opts[v].label || String(v);
                                                    } else {
                                                        valueDisplay = String(v);
                                                    }
                                                } else if (cond && cond.interaction_type === 'range') {
                                                    // expect v to be { min, max }
                                                    const min =
                                                        typeof v === 'object' && v !== null && 'min' in (v as Record<string, unknown>)
                                                            ? (v as { min: any }).min
                                                            : '';
                                                    const max =
                                                        typeof v === 'object' && v !== null && 'max' in (v as Record<string, unknown>)
                                                            ? (v as { max: any }).max
                                                            : '';
                                                    if (cond.type === 'date') {
                                                        const fmt = (d: any) => {
                                                            const dt = new Date(d);
                                                            return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString('es-CO');
                                                        };
                                                        valueDisplay = `Desde ${fmt(min)} hasta ${fmt(max)}`;
                                                    } else {
                                                        valueDisplay = `Desde ${String(min)} hasta ${String(max)}`;
                                                    }
                                                } else {
                                                    valueDisplay = typeof v === 'object' ? JSON.stringify(v) : String(v);
                                                }

                                                return (
                                                    <li key={k}>
                                                        {condLabel}: {valueDisplay}
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li>(sin respuestas)</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper component: renders one condition at a time and navigation
function ConditionStepper({
    conditions,
    initialConditionId,
    initialHistory,
    answers,
    onAnswer,
    onComplete,
}: {
    conditions: ViewData['conditions'];
    initialConditionId: number | null | undefined;
    initialHistory?: number[] | null | undefined;
    answers: Record<string, any>;
    onAnswer: (cid: string, value: any) => void;
    onComplete?: (snapshot: { currentId: number | null; history: number[]; answers: Record<string, any> }) => void;
}) {
    const [currentId, setCurrentId] = useState<number | null>(initialConditionId ?? null);
    const [history, setHistory] = useState<number[]>(initialHistory ? [...initialHistory] : []);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // reset when initialConditionId changes
    React.useEffect(() => {
        setCurrentId(initialConditionId ?? null);
        setHistory(initialHistory ? [...initialHistory] : []);
        setSelectedOption(null);
    }, [initialConditionId, initialHistory]);

    if (!conditions || currentId === null) {
        return <p className="text-center text-slate-500">Condición inicial no configurada.</p>;
    }

    const cond = conditions[String(currentId)];
    if (!cond) {
        return <p className="text-center text-slate-500">Condición no encontrada ({currentId}).</p>;
    }

    const inputClass =
        'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-[#0693e3] focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20';

    const goNext = (nextId?: number | null) => {
        if (nextId === undefined || nextId === null) return;
        setHistory((h) => [...h, currentId as number]);
        setCurrentId(nextId);
        setSelectedOption(null);
    };

    const goBack = () => {
        setHistory((h) => {
            const copy = [...h];
            const prev = copy.pop();
            setCurrentId(prev ?? null);
            return copy;
        });
    };

    // Render input according to interaction_type
    const renderControl = () => {
        if (cond.interaction_type === 'input') {
            const inputType = cond.type === 'number' ? 'number' : cond.type === 'date' ? 'date' : 'text';
            const val = answers[String(currentId)] ?? '';
            return (
                <input
                    className={inputClass}
                    type={inputType}
                    value={val}
                    onChange={(e) => onAnswer(String(currentId), e.target.value)}
                />
            );
        }

        if (cond.interaction_type === 'range') {
            const t = cond.type === 'date' ? 'date' : cond.type === 'number' ? 'number' : 'text';
            const v = answers[String(currentId)] ?? { min: '', max: '' };
            return (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                        className={inputClass}
                        type={t}
                        placeholder="Desde"
                        value={v.min}
                        onChange={(e) => onAnswer(String(currentId), { ...v, min: e.target.value })}
                    />
                    <input
                        className={inputClass}
                        type={t}
                        placeholder="Hasta"
                        value={v.max}
                        onChange={(e) => onAnswer(String(currentId), { ...v, max: e.target.value })}
                    />
                </div>
            );
        }

        if (cond.interaction_type === 'options') {
            const opts = Array.isArray((cond as any).options) ? (cond as any).options : [];
            const currentAnswer = answers[String(currentId)];
            const selectedIndex =
                typeof currentAnswer === 'number'
                    ? currentAnswer
                    : typeof currentAnswer === 'object' && currentAnswer !== null && 'optionIndex' in currentAnswer
                      ? (currentAnswer as { optionIndex: number }).optionIndex
                      : null;
            const selectedText =
                typeof currentAnswer === 'object' && currentAnswer !== null && 'text' in currentAnswer
                    ? ((currentAnswer as { text?: string }).text ?? '')
                    : '';

            return (
                <div className="space-y-3">
                    {opts.map((o: any, i: number) => (
                        <div key={i} className="space-y-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1 transition-colors hover:text-[#0693e3]">
                                <input
                                    type="radio"
                                    name={`opt-${currentId}`}
                                    checked={selectedIndex === i}
                                    onChange={() => {
                                        if (o.is_other) {
                                            onAnswer(String(currentId), { optionIndex: i, text: '' });
                                        } else {
                                            onAnswer(String(currentId), i);
                                        }
                                        setSelectedOption(i);
                                    }}
                                    className="h-4 w-4 shrink-0 border-slate-300 text-[#0693e3] focus:ring-[#0693e3]"
                                />
                                <span className="text-sm font-medium text-slate-800">{o.label || '(sin etiqueta)'}</span>
                            </label>

                            {o.is_other && selectedIndex === i && (
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Escribe tu respuesta"
                                    value={selectedText}
                                    onChange={(e) => onAnswer(String(currentId), { optionIndex: i, text: e.target.value })}
                                />
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return <div>Tipo desconocido</div>;
    };

    const computeNextFromOption = () => {
        if (cond.interaction_type !== 'options') return cond.next_condition ?? null;
        const opts = Array.isArray((cond as any).options) ? (cond as any).options : [];
        const sel = answers[String(currentId)];
        if (sel === undefined || sel === null) return cond.next_condition ?? null;
        const selectedIndex =
            typeof sel === 'number'
                ? sel
                : typeof sel === 'object' && sel !== null && 'optionIndex' in sel
                  ? (sel as { optionIndex: number }).optionIndex
                  : null;
        if (selectedIndex === null) return cond.next_condition ?? null;
        const opt = opts[selectedIndex];
        return opt && opt.next_condition ? Number(opt.next_condition) : (cond.next_condition ?? null);
    };

    const nextId = computeNextFromOption();

    const [validationError, setValidationError] = useState<string | null>(null);

    // run validation for current control
    React.useEffect(() => {
        setValidationError(null);
        const val = answers[String(currentId)];

        if (cond.interaction_type === 'input') {
            if (val === undefined || val === null || String(val).trim() === '') {
                setValidationError('Este campo es obligatorio');
            }
        }

        if (cond.interaction_type === 'range') {
            const t = cond.type === 'date' ? 'date' : cond.type === 'number' ? 'number' : 'text';
            const v = val ?? { min: '', max: '' };
            const min = v.min;
            const max = v.max;
            if (String(min).trim() === '' || String(max).trim() === '') {
                setValidationError('Ambos valores son requeridos');
            } else if (t === 'number') {
                const nmin = Number(min);
                const nmax = Number(max);
                if (Number.isNaN(nmin) || Number.isNaN(nmax)) setValidationError('Valores numéricos inválidos');
                else if (!(nmin < nmax)) setValidationError('El valor inicial debe ser menor que el valor final');
            } else if (t === 'date') {
                const dmin = new Date(min);
                const dmax = new Date(max);
                if (isNaN(dmin.getTime()) || isNaN(dmax.getTime())) setValidationError('Fechas inválidas');
                else if (!(dmin < dmax)) setValidationError('La fecha inicial debe ser anterior a la fecha final');
            } else {
                if (!(String(min) < String(max))) setValidationError('Rango inválido');
            }
        }

        if (cond.interaction_type === 'options') {
            const sel = answers[String(currentId)];
            if (sel === undefined || sel === null) {
                setValidationError('Selecciona una opción');
            } else if (typeof sel === 'object' && sel !== null && 'text' in sel) {
                const textValue = (sel as { text?: string }).text ?? '';
                if (String(textValue).trim() === '') setValidationError('Escribe tu respuesta');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, currentId]);

    const canProceed = !validationError;

    return (
        <Card className="w-full max-w-4xl overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
            <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="mb-5">
                    <h4 className="text-xl font-bold text-slate-900 md:text-2xl">{cond.label}</h4>
                    {cond.observation && <p className="mt-2 text-sm italic leading-relaxed text-slate-600">{cond.observation}</p>}
                </div>

                <div className="mb-5">{renderControl()}</div>

                {validationError && <div className="mb-4 text-sm font-medium text-red-600">{validationError}</div>}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={history.length === 0}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        Anterior
                    </button>
                    <div>
                        {nextId ? (
                            <button
                                type="button"
                                onClick={() => canProceed && goNext(nextId)}
                                disabled={!canProceed}
                                className="w-full rounded-xl bg-[#0693e3] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0693e3]/25 transition hover:bg-[#047ac0] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!canProceed) return;
                                    onComplete?.({ currentId, history, answers });
                                }}
                                disabled={!canProceed}
                                className="w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                            >
                                Finalizar
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
