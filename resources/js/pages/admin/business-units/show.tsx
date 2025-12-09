import React from "react";
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
    <div style={{ padding: 20 }}>
      <h1>Props recibidos</h1>

      <h2>viewData</h2>
      <pre>{JSON.stringify(viewData, null, 2)}</pre>

      <h2>errors</h2>
      <pre>{JSON.stringify(errors, null, 2)}</pre>

      <hr />

      <div>
        <h2>Unidad de Negocio</h2>
        {viewData.businessUnit ? (
          <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
            <p><strong>ID:</strong> {viewData.businessUnit.id}</p>
            <p><strong>Nombre:</strong> {viewData.businessUnit.name}</p>
          </div>
        ) : (
          <p>No hay unidad de negocio disponible.</p>
        )}

        <h2>Servicios Asociados</h2>
        {viewData.services && viewData.services.length === 0 ? (
          <p>No hay servicios asociados a esta unidad de negocio.</p>
        ) : (
          <ul>
            {viewData.services?.map((service) => (
              <li key={service.id}>
                <strong>{service.name}</strong> (ID: {service.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}