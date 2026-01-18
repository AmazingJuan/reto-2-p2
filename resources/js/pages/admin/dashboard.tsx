import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { ChevronRight, GitBranch, ScrollText, Users, Wrench, BriefcaseBusiness } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

const Dashboard: React.FC = () => {
    const items = [
        {
            label: 'Usuarios',
            name: 'dashboard',
            desc: 'Gestiona cuentas, roles y permisos',
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
    ] as const;

    const badgeClasses: Record<string, string> = {
        indigo: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100',
        emerald: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
        amber: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100',
    };

    return (
        <AdminLayout>
            <section className="mx-auto mb-10 mt-6 max-w-4xl text-center">
                <h2 className="text-4xl font-bold leading-tight text-slate-900">Dashboard</h2>
                <p className="mt-2 text-gray-600">Acceso rápido a los recursos de administración</p>
            </section>

            <section className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </AdminLayout>
    );
};

export default Dashboard;
