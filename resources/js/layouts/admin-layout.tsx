import Footer from '@/components/admin/footer';
import { Link, usePage } from '@inertiajs/react';
import { Box, FileText, Home, Layers, Menu, Settings, Trees, Users, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { route } from 'ziggy-js';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { to: route('dashboard.users.index'), label: 'Usuarios', icon: Users },
    { to: route('dashboard.business-unit.index'), label: 'Unidades de negocio', icon: Trees },
    { to: route('dashboard.lines.index'), label: 'Líneas de gestión', icon: Layers },
    { to: route('dashboard.services.index'), label: 'Servicios', icon: Box },
    { to: route('dashboard.business-unit.decision-tree'), label: 'Árbol de decisión', icon: Trees },
    { to: route('dashboard.quotation-orders.index'), label: 'Cotizaciones', icon: FileText },
    { to: route('dashboard.configurations.edit'), label: 'Configuración', icon: Settings },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

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
            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform border-r bg-white transition-transform duration-200 ease-in-out md:static md:block md:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                    aria-hidden={!sidebarOpen}
                >
                    <div className="sticky top-0 flex h-full flex-col justify-between">
                        <div>
                            <div className="border-b p-6">
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
                <div className="min-h-screen flex-1">
                    {/* Mobile topbar */}
                    <div className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
                        <button
                            ref={menuButtonRef}
                            onClick={openSidebar}
                            className="rounded-md p-2 text-slate-700 hover:bg-slate-50"
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link href={route('dashboard')} className="text-sm font-semibold">
                            Panel Admin
                        </Link>
                        <div />
                    </div>

                    <main className="mx-auto max-w-7xl p-4 pt-[96px] md:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {!route().current('dashboard') && (
                                    <Link
                                        href={route('dashboard')}
                                        className="hidden items-center gap-2 rounded bg-white px-3 py-2 text-sm shadow-sm md:inline-flex"
                                    >
                                        <Home className="h-4 w-4" />
                                        Volver al dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">{children}</div>
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
