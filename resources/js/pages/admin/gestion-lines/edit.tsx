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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Editar Línea de Gestión</h1>
            <p className="mt-2 text-sm text-gray-600">Modifique el campo necesario para actualizar la línea de gestión</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Información básica */}
              <div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ingrese el nombre de la línea de gestión"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? 'Actualizando...' : 'Actualizar Línea de Gestión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}