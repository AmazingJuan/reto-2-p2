import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';

interface FormData {
  name: string;
  needs_error: boolean;
}

interface BusinessUnit {
  id: number;
  name: string;
}

type EditPageProps = PageProps & {
  viewData: {
    businessUnit: BusinessUnit;
  };
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
};

export default function EditBusinessUnit() {
  const { viewData, errors, flash } = usePage<EditPageProps>().props;
  const validationErrors = errors ?? {};
  const flashMessages = flash ?? {};
  const businessUnit = viewData?.businessUnit;

  const [form, setForm] = useState<FormData>({
    name: businessUnit?.name ?? '',
    needs_error: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessUnit?.id) return;

    router.put(route('dashboard.business-unit.update', businessUnit.id), {
      ...form,
      needs_error: form.needs_error ? 'true' : 'false',
    });
  };

  if (!businessUnit) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-2">
          <p className="text-red-600">Unidad de negocio no encontrada.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-2">
        <h1 className="text-2xl font-bold mb-4">Editar Unidad de Negocio</h1>

      {validationErrors.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {validationErrors.error}
        </div>
      )}

      {flashMessages.success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {flashMessages.success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">
            Nombre de la unidad
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {validationErrors.name && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="needs_error"
            id="needs_error"
            checked={form.needs_error}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="needs_error" className="font-medium">
            Simular error de prueba
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Actualizar Unidad
          </button>
          <button
            type="button"
            onClick={() => router.visit(route('dashboard.business-unit.index'))}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>
      </div>
    </AdminLayout>
  );
}
