import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, UserCircle } from 'lucide-react';
import { route } from 'ziggy-js';

interface Professional {
    id: number;
    name: string;
    summary: string;
    years_experience: number;
    gestion_lines: { id: number; name: string }[];
}

type ShowProps = PageProps<{
    viewData: { professional: Professional };
}>;

export default function Show() {
    const { viewData } = usePage<ShowProps>().props;
    const { professional } = viewData;

    return (
        <AdminLayout>
            <Head title={`Profesional #${professional.id}`} />

            <div className="mx-auto w-full max-w-3xl space-y-6">
                <Link
                    href={route('dashboard.professionals.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al listado
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <UserCircle className="h-10 w-10 shrink-0 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{professional.name}</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                ID {professional.id} · {professional.years_experience} años de experiencia
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('dashboard.professionals.edit', professional.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-700 sm:w-auto"
                    >
                        <Pencil className="h-4 w-4" />
                        Editar
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Líneas de gestión</h2>
                    {professional.gestion_lines.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-600">Sin líneas asignadas.</p>
                    ) : (
                        <ul className="mt-3 list-inside list-disc text-sm text-slate-800">
                            {professional.gestion_lines.map((l) => (
                                <li key={l.id}>{l.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resumen</h2>
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{professional.summary}</div>
                </div>
            </div>
        </AdminLayout>
    );
}
