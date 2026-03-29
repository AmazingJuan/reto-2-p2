import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { ChevronRight, GitBranch, Mail, ScrollText, Settings, Users, Wrench, BriefcaseBusiness, Trees } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

const Dashboard: React.FC = () => {
    const items = [
        {
            label: 'Usuarios',
            name: 'dashboard.users.index',
            desc: 'Gestiona cuentas del sistema',
            icon: Users,
            accent: 'indigo',
        },
        {
            label: 'Servicios',
            name: 'dashboard.services.index',
            desc: 'Crea y administra tus servicios',
            icon: Wrench,
            accent: 'emerald',
        },
        {
            label: 'Líneas de gestión',
            name: 'dashboard.lines.index',
            desc: 'Organiza procesos y flujos',
            icon: GitBranch,
            accent: 'amber',
        },
        {
            label: 'Lista Cotizaciones',
            name: 'dashboard.quotation-orders.index',
            desc: 'Visualiza y gestiona cotizaciones',
            icon: ScrollText,
            accent: 'indigo',
        },
        {
            label: 'Unidad de negocio',
            name: 'dashboard.business-unit.index',
            desc: 'Visualiza y gestiona las unidades de negocio',
            icon: BriefcaseBusiness,
            accent: 'emerald',
        },
        {
            label: 'Árbol de cotización',
            name: 'dashboard.business-unit.decision-tree',
            desc: 'Configura el árbol de decisión para cotizaciones',
            icon: Trees,
            accent: 'amber',
        },
        {
            label: 'Configuración',
            name: 'dashboard.configurations.edit',
            desc: 'Correo de notificaciones y URL de la aplicación',
            icon: Settings,
            accent: 'indigo',
        },
        {
            label: 'Correos de bienvenida',
            name: 'dashboard.welcome-broadcast.create',
            desc: 'Enviar el correo de bienvenida a una lista de direcciones',
            icon: Mail,
            accent: 'emerald',
        },
    ] as const;

    const badgeClasses: Record<string, string> = {
        indigo: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100',
        emerald: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
        amber: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100',
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-5xl px-4 pb-10 pt-6">
                <div className="mb-6 flex justify-end">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 rounded border border-[#0693e3] bg-white px-3 py-2 text-sm font-semibold text-[#0693e3] shadow-sm transition hover:bg-[#0693e3] hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0h-11.25M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
                            />
                        </svg>
                        Salir
                    </Link>
                </div>
                <section className="mx-auto mb-8 max-w-4xl text-center">
                    <h2 className="text-4xl font-bold leading-tight text-slate-900">Dashboard</h2>
                    <p className="mt-2 text-gray-600">Acceso rápido a los recursos de administración</p>
                </section>

                <section className="mx-auto grid max-w-5xl gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ label, name, desc, icon: Icon, accent }) => (
                        <Link
                            key={name}
                            href={route(name)}
                            className="group relative block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex items-start gap-4">
                                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${badgeClasses[accent]}`}>
                                    <Icon className="h-5 w-5" />
                                </span>

                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900">{label}</h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{desc}</p>
                                </div>

                                <ChevronRight className="ml-auto h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
