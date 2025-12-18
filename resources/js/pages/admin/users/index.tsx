import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import Footer from '@/components/ui/footer';
import GoDashboard from '@/components/ui/godashboard';
import Header from '@/components/ui/header';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        users: User[];
    };
}

export default function IndexUsers() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { users } = viewData;

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar este usuario?')) {
            router.delete(route('dashboard.users.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.users.edit', id));
    };

    const handleCreate = () => {
        router.get(route('dashboard.users.create'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <GoDashboard />

            <div className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Usuarios</h1>
                <FlashAlert flash={flash} duration={5000} />
                <div className="mb-4 flex justify-end">
                    <Button variant="crear" onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus /> Crear usuario
                    </Button>
                </div>

                <table className="min-w-full rounded-lg border bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">Nombre</th>
                            <th className="border-b px-4 py-2">Correo</th>
                            <th className="border-b px-4 py-2">Teléfono</th>
                            <th className="border-b px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border-b px-4 py-2 text-center">{user.id}</td>
                                <td className="border-b px-4 py-2">{user.name}</td>
                                <td className="border-b px-4 py-2">{user.email}</td>
                                <td className="border-b px-4 py-2">{user.phone}</td>
                                <td className="border-b px-4 py-2">
                                    <div className="flex items-center justify-center gap-5">
                                        <button onClick={() => handleEdit(user.id)} className="transform transition hover:scale-110" title="Editar">
                                            <Pencil className="h-5 w-5 text-indigo-600 hover:text-indigo-600" />
                                        </button>

                                        <button onClick={() => handleDelete(user.id)} className="transform transition hover:scale-110" title="Borrar">
                                            <Trash2 className="h-5 w-5 text-red-600 hover:text-red-700" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 text-center">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Footer />
        </div>
    );
}
