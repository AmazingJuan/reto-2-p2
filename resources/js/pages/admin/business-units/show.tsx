import React from "react";
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from "@inertiajs/core";

interface BusinessUnit {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  [key: string]: any;
}

interface Props extends PageProps {
  viewData: {
    businessUnit: BusinessUnit;
    services: Service[];
  };
  errors?: Record<string, string>;
}

export default function ShowBusinessUnit({ viewData, errors = {} }: Props) {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Unidad de Negocio</h1>

        <div className="mb-6">
          <h2 className="font-medium">Detalles</h2>
          <pre className="bg-gray-50 p-4 rounded mt-2">{JSON.stringify(viewData, null, 2)}</pre>
        </div>

        <div>
          <h2 className="font-medium">Servicios Asociados</h2>
          {viewData.services && viewData.services.length === 0 ? (
            <p className="text-sm text-gray-500">No hay servicios asociados a esta unidad de negocio.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {viewData.services?.map((service) => (
                <li key={service.id} className="p-3 rounded border bg-white">
                  <strong>{service.name}</strong> <span className="text-sm text-gray-500">(ID: {service.id})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}