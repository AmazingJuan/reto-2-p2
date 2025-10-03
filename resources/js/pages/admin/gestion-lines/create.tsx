import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Header from '@/components/admin/Header';
import Footer from '@/components/admin/Footer';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.lines.store'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Línea de Gestión</h1>

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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
