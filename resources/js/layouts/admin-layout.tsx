import Footer from '@/components/admin/footer';
import { Link, usePage } from '@inertiajs/react';
import { Box, FileText, Home, Layers, Mail, Menu, Settings, Trees, UserCircle, Users, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { to: route('dashboard.users.index'), label: 'Usuarios', icon: Users },
    { to: route('dashboard.professionals.index'), label: 'Profesionales', icon: UserCircle },
    { to: route('dashboard.business-unit.index'), label: 'Unidades de negocio', icon: Trees },
    { to: route('dashboard.lines.index'), label: 'Líneas de gestión', icon: Layers },
    { to: route('dashboard.services.index'), label: 'Servicios', icon: Box },
    { to: route('dashboard.business-unit.decision-tree'), label: 'Árbol de decisión', icon: Trees },
    { to: route('dashboard.quotation-orders.index'), label: 'Cotizaciones', icon: FileText },
    { to: route('dashboard.welcome-broadcast.create'), label: 'Correos de bienvenida', icon: Mail },
    { to: route('dashboard.configurations.edit'), label: 'Configuración', icon: Settings },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
    );
    const { url } = usePage();
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const onChange = () => {
            setIsDesktop(mq.matches);
            if (mq.matches) setSidebarOpen(false);
        };
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const openSidebar = () => {
        setSidebarOpen(true);
        // move focus into the sidebar for screen readers
        setTimeout(() => {
            const firstLink = document.querySelector('aside a');
            (firstLink as HTMLElement | null)?.focus();
        }, 50);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        // return focus to the menu button to avoid leaving focus inside an aria-hidden element
        setTimeout(() => {
            menuButtonRef.current?.focus();
        }, 0);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex min-w-0">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[calc(100vw-1rem)] shrink-0 flex-col overflow-y-auto border-r bg-white transition-transform duration-200 ease-in-out sm:max-w-none md:static md:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                    aria-hidden={isDesktop ? false : !sidebarOpen}
                >
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div>
                            <div className="border-b p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <Link href={route('dashboard')} className="flex items-center gap-3">
                                        <div className="rounded-md bg-blue-600 p-2 text-white">
                                            <Home className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Panel Admin</h3>
                                            <p className="text-xs text-slate-500">Administración del sistema</p>
                                        </div>
                                    </Link>
                                    <button
                                        type="button"
                                        aria-label="Cerrar menú"
                                        onClick={closeSidebar}
                                        className="rounded-md p-2 text-slate-500 hover:bg-slate-50 md:hidden"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <nav className="p-4">
                                <ul className="space-y-1">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;

                                        const currentPath = (() => {
                                            try {
                                                return new URL(url ?? window.location.href).pathname;
                                            } catch {
                                                return url ?? window.location.pathname;
                                            }
                                        })();

                                        const normalize = (to: string) => {
                                            try {
                                                return new URL(to, window.location.origin).pathname;
                                            } catch {
                                                return to as string;
                                            }
                                        };

                                        const toPath = normalize(item.to as string);
                                        const isActive = currentPath === toPath || currentPath.startsWith(toPath + '/');

                                        return (
                                            <li key={item.label}>
                                                <Link
                                                    href={item.to}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                                                            : 'hover:bg-slate-50 hover:text-blue-600'
                                                    }`}
                                                >
                                                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Content area */}
                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    {/* Mobile topbar */}
                    <header className="grid shrink-0 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-1 border-b border-slate-200 bg-white px-2 py-2.5 supports-[padding:max(0px)]:pt-[max(0.625rem,env(safe-area-inset-top))] sm:grid-cols-[3rem_1fr_auto] sm:px-3 md:hidden">
                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={openSidebar}
                            className="justify-self-start rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link
                            href={route('dashboard')}
                            className="min-w-0 justify-self-center truncate text-center text-sm font-semibold text-slate-900"
                        >
                            Panel Admin
                        </Link>
                        <div className="justify-self-end">
                            {!route().current('dashboard') ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:px-2.5"
                                >
                                    <Home className="h-4 w-4 shrink-0" />
                                    Inicio
                                </Link>
                            ) : (
                                <span className="inline-block w-10" aria-hidden />
                            )}
                        </div>
                    </header>

                    <main className="mx-auto w-full min-w-0 max-w-[100vw] flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
                        <div className="mb-4 hidden items-center justify-between md:flex md:mb-6">
                            <div className="flex items-center gap-3">
                                {!route().current('dashboard') && (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                    >
                                        <Home className="h-4 w-4" />
                                        Volver al dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0 space-y-4 sm:space-y-6">{children}</div>
                    </main>
                </div>
            </div>

            {/** Overlay for mobile when sidebar is open */}
            {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={closeSidebar} />}

            <Footer />
        </div>
    );
};

export default AdminLayout;
