import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface FormData {
  name: string;
  needs_error: boolean;
}

type CreatePageProps = PageProps & {
  errors: Record<string, string>;
  flash: {
    success?: string;
    error?: string;
  };
};

export default function CreateBusinessUnit() {
  const { errors, flash } = usePage<CreatePageProps>().props;
  const validationErrors = errors ?? {};
  const flashMessages = flash ?? {};
  const [form, setForm] = useState<FormData>({
    name: '',
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
    router.post(route('dashboard.business-unit.store'), {
      ...form,
      needs_error: form.needs_error ? 'true' : 'false', // convierte a string para el backend
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Crear Unidad de Negocio</h1>

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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Unidad
        </button>
      </form>
    </div>
  );
}
