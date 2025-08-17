import React from "react";
import { PageProps } from "@inertiajs/core";
import { Service } from '../types/service';
import { useServiceSelection } from '../hooks/useServiceSelection';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceDetails } from '../components/ServiceDetails';

interface Props extends PageProps {
  services: Service[];
}

export default function Servicios({ services }: Props) {
  const { selectedService, selectService, clearSelection } = useServiceSelection();

  return (
    <div className="flex h-screen">
      {/* Lista de servicios */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Lista de Servicios</h1>
        <ul className="space-y-2">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={selectService}
            />
          ))}
        </ul>
      </div>

      {/* Panel de detalles */}
      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={clearSelection}
        />
      )}
    </div>
  );
}