import React, { useState } from "react";
import { PageProps } from "@inertiajs/core";

interface Service {
  id: number;
  name: string;
  description: string;
  gestion_line: string;
  type: string;
}

interface Props extends PageProps {
  services: Service[];
}

export default function Servicios({ services }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="flex h-screen">
      {/* Lista de servicios */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Lista de Servicios</h1>
        <ul className="space-y-2">
          {services.map((service) => (
            <li
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="p-4 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-gray-600 truncate">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel de detalles */}
      {selectedService && (
        <div className="w-96 border-l bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Detalles del Servicio</h2>
            <button
              onClick={() => setSelectedService(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg font-semibold">{selectedService.name}</h3>
          <p className="text-gray-700 mt-2">{selectedService.description}</p>
          <p className="mt-4">
            <span className="font-semibold">Tipo:</span>{" "}
            {selectedService.type}
          </p>
          <p>
            <span className="font-semibold">Línea de gestión:</span>{" "}
            {selectedService.gestion_line}
          </p>
        </div>
      )}
    </div>
  );
}
