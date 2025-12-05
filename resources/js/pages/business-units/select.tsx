import React from "react";
import { PageProps } from "@inertiajs/core";

interface Props extends PageProps {
  viewData: {
    businessUnits: string[];
  };
  errors?: Record<string, string>;
}

export default function SelectBusinessUnits({ viewData, errors = {} }: Props) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Props recibidos</h1>

      <h2>viewData</h2>
      <pre>{JSON.stringify(viewData, null, 2)}</pre>

      <h2>errors</h2>
      <pre>{JSON.stringify(errors, null, 2)}</pre>

      <hr />

      <h2>Business Units</h2>
      {viewData.businessUnits.length === 0 ? (
        <p>No hay unidades de negocio.</p>
      ) : (
        <ul>
          {viewData.businessUnits.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

//Boton cotizar Boton admin PR !!!!
