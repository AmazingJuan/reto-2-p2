import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, GitBranch, Layers } from 'lucide-react';
import { useState } from 'react';
import Footer from '../footer';
import GoSelect from '../goselect';
import Header from '../header';
import ServicesByLine from './ServicesByLine';
import React from 'react';
import { router } from '@inertiajs/react';

interface ViewData {
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
            allows_multiple_values: boolean;
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
    const [showContactModal, setShowContactModal] = useState(false);

    // contact form state
    const [contact, setContact] = useState({ name: '', company: '', email: '', phone: '' });
    const [showSavedDetails, setShowSavedDetails] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const visibleLines = viewData.gestionLines.filter((line) => (viewData.services[line]?.length ?? 0) > 0);

    // handlers for contact modal
    const handleSendContact = () => {
        // basic validation (inline)
        const errors: Record<string, string[]> = {};
        if (!contact.name.trim()) errors.name = ['Por favor ingresa nombre.'];
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
                    if (typeof v === 'number' && opts[v]) valueDisplay = opts[v].label || String(v);
                    else valueDisplay = String(v);
                } else if (cond && cond.interaction_type === 'range') {
                    const isRange = typeof v === 'object' && v !== null && 'min' in (v as Record<string, unknown>) && 'max' in (v as Record<string, unknown>);
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
                    setContact({ name: '', company: '', email: '', phone: '' });
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
        setShowSavedDetails(false);
        // keep savedSnapshot so the stepper can receive initialHistory from it
    };

    // when user selects a service, initialize the condition stepper id
    React.useEffect(() => {
        if (selectedServices && selectedServices.length >= 1) {
            setConditionInitialId(viewData.initial_condition_id ?? null);
        }
    }, [selectedServices, viewData.initial_condition_id]);

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Blobs decorativos */}
            <div className="blob pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-[#0693e3]/10 blur-3xl" />
            <div className="blob pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '-4s' }} />
            
            <Header />
            <GoSelect />

            <main className="container mx-auto flex-1 px-4 pb-24 pt-4">
                {/* Título */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0693e3]/20 to-emerald-500/20 shadow-lg shadow-[#0693e3]/10">
                        <GitBranch className="h-8 w-8 text-[#0693e3]" />
                    </div>

                    <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
                        <span className="text-gradient">{capitalize(viewData.businessUnit)}</span>
                    </h2>

                    <p className="mx-auto max-w-xl text-slate-600">Selecciona una línea de gestión para ver sus servicios</p>
                </div>

                {/* Cards */}
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleLines.map((line, index) => {
                        const isSelected = selectedLine === line;

                        return (
                            <Card
                                key={line}
                                onClick={() => { setSelectedLine(line); setSelectedServices([]); }}
                                className={`animate-slide-up stagger-${index + 1} card-shine hover-lift group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                                    isSelected 
                                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-lg shadow-emerald-500/20' 
                                        : 'border-slate-200 bg-white hover:border-[#0693e3]/50 hover:shadow-lg'
                                }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        {/* Icono */}
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                                            isSelected 
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                                : 'bg-slate-100 text-slate-600 group-hover:bg-[#0693e3]/10 group-hover:text-[#0693e3]'
                                        }`}>
                                            <Layers className="h-6 w-6" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900">{capitalize(line)}</h3>
                                        </div>

                                        {isSelected && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                      })}
                </div>

                {/* Servicios */}
                {selectedLine && (
                    <div className="animate-fade-in mt-10">
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
                        <div className="mt-10">
                            <h3 className="mb-2 text-center text-2xl font-bold leading-tight text-slate-900 md:text-2xl">
                                Condiciones para {selectedServices.length === 1 ? selectedServices[0] : `${selectedServices.length} servicios seleccionados`}
                            </h3>
                            <p className="mb-6 text-center text-slate-600">Responde las condiciones una a una</p>

                            {!viewData.conditions || Object.keys(viewData.conditions).length === 0 ? (
                                <p className="text-center text-slate-500">No hay condiciones disponibles para este servicio.</p>
                            ) : (
                                <div className="flex flex-col items-center">
                                    {/* initialize currentConditionId when selecting a service */}
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

                                            // show contact modal; do NOT redirect here — redirect happens on Enviar
                                            setShowContactModal(true);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })()}
                        
            </main>

            {/* Contact modal shown after finalizar */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowContactModal(false)} />

                    <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-2 text-xl font-bold text-slate-900">Casi listo — déjanos tus datos</h3>
                        <p className="mb-4 text-sm text-slate-600">Ingresa tus datos para que podamos contactarte sobre esta cotización.</p>

                        {(() => {
                            const fieldKeys = ['name', 'company', 'email', 'phone'];
                            const globalMsgs: string[] = formErrors._global ? [...formErrors._global] : [];
                            const otherMsgs: string[] = Object.entries(formErrors)
                                .filter(([k]) => k !== '_global' && !fieldKeys.includes(k))
                                .flatMap(([, msgs]) => msgs as string[]);
                            const topMsgs = [...globalMsgs, ...otherMsgs];
                            if (topMsgs.length === 0) return null;

                            return (
                                <div className="mb-3 rounded border bg-red-50 p-3 text-sm text-red-700">
                                    <ul className="list-inside list-disc">
                                        {topMsgs.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="col-span-2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
                                <input value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="Tu nombre" />
                                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
                                <input value={contact.company} onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="Nombre de la empresa (opcional)" />
                                {formErrors.company && <p className="mt-1 text-sm text-red-600">{formErrors.company[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
                                <input value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="correo@ejemplo.com" />
                                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email[0]}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                                <input value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="+57 300 123 4567" />
                                {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={handleSendContact} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Enviar</button>
                                <button onClick={handleReturnToSnapshot} className="rounded border px-4 py-2 text-sm text-slate-700">Volver</button>
                                <button onClick={() => setShowSavedDetails((v) => !v)} className="rounded px-3 py-2 text-sm text-slate-700">{showSavedDetails ? 'Ocultar' : 'Visualizar el resumen de la propuesta'}</button>
                            </div>
                        </div>

                        {showSavedDetails && savedSnapshot && (
                            <div className="mt-4 max-h-48 overflow-auto rounded border p-3 bg-slate-50">
                                <h4 className="mb-2 text-sm font-semibold">Resumen previo</h4>
                                <p className="text-sm text-slate-700"><strong>Línea de Gestión:</strong> {savedSnapshot.selectedLine || '-'} </p>
                                <p className="text-sm text-slate-700"><strong>Servicio(s):</strong> {Array.isArray(savedSnapshot.selectedServices) && savedSnapshot.selectedServices.length > 0 ? savedSnapshot.selectedServices.join(', ') : '-'} </p>
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
                                                    if (typeof v === 'number' && opts[v]) valueDisplay = opts[v].label || String(v);
                                                    else valueDisplay = String(v);
                                                } else if (cond && cond.interaction_type === 'range') {
                                                    // expect v to be { min, max }
                                                    const min = typeof v === 'object' && v !== null && 'min' in (v as Record<string, unknown>) ? (v as { min: any }).min : '';
                                                    const max = typeof v === 'object' && v !== null && 'max' in (v as Record<string, unknown>) ? (v as { max: any }).max : '';
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

                                                return <li key={k}>{condLabel}: {valueDisplay}</li>;
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

            <Footer />
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

    if (!conditions || currentId === null) return <p className="text-center text-slate-500">Condición inicial no configurada.</p>;

    const cond = conditions[String(currentId)];
    if (!cond) return <p className="text-center text-slate-500">Condición no encontrada ({currentId}).</p>;

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
                    className="border rounded-lg p-2 w-full"
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
                <div className="grid grid-cols-2 gap-3">
                    <input className="border rounded-lg p-2" type={t} placeholder="Desde" value={v.min} onChange={(e) => onAnswer(String(currentId), { ...v, min: e.target.value })} />
                    <input className="border rounded-lg p-2" type={t} placeholder="Hasta" value={v.max} onChange={(e) => onAnswer(String(currentId), { ...v, max: e.target.value })} />
                </div>
            );
        }

        if (cond.interaction_type === 'options') {
            const opts = Array.isArray((cond as any).options) ? (cond as any).options : [];
            return (
                <div className="space-y-2">
                    {opts.map((o: any, i: number) => (
                        <label key={i} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`opt-${currentId}`}
                                checked={answers[String(currentId)] === i}
                                onChange={() => {
                                    onAnswer(String(currentId), i);
                                    setSelectedOption(i);
                                }}
                            />
                            <span>{o.label || '(sin etiqueta)'}</span>
                        </label>
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
        const opt = opts[sel];
        return opt && opt.next_condition ? Number(opt.next_condition) : cond.next_condition ?? null;
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
            if (sel === undefined || sel === null) setValidationError('Selecciona una opción');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, currentId]);

    const canProceed = !validationError;

    return (
        <Card className="w-full max-w-4xl">
            <CardContent className="p-8">
                <div className="mb-3 flex items-start justify-between">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900">{cond.label}</h4>
                        {cond.observation && <p className="mt-2 text-sm italic text-slate-600">{cond.observation}</p>}
                    </div>
                    {/* No mostrar marca de condición inicial */}
                </div>

                <div className="mb-4">{renderControl()}</div>

                {validationError && <div className="mb-4 text-sm text-red-600">{validationError}</div>}

                <div className="flex items-center justify-between">
                    <div>
                        <button onClick={goBack} disabled={history.length === 0} className="mr-2 rounded px-3 py-1 text-sm text-slate-700 disabled:opacity-50">
                            Anterior
                        </button>
                    </div>
                    <div>
                        {nextId ? (
                            <button
                                onClick={() => canProceed && goNext(nextId)}
                                disabled={!canProceed}
                                className={`rounded px-3 py-1 text-sm text-white ${canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300'}`}
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!canProceed) return;
                                    onComplete?.({ currentId, history, answers });
                                }}
                                disabled={!canProceed}
                                className={`rounded px-3 py-1 text-sm text-white ${canProceed ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300'}`}
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
