import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Header from '@/components/admin/Header';
import Footer from '@/components/admin/Footer';

interface GestionLine {
  id: number;
  name: string;
}

interface PageProps {
  gestionLine: GestionLine;
}

export default function Edit() {
  const { props } = usePage<PageProps>();
  const { gestionLine } = props;

  const { data, setData, put, processing, errors } = useForm({
    name: gestionLine.name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.lines.update', { id: gestionLine.id }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Línea de Gestión</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de la línea de gestión"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {processing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
