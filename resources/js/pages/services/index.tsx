interface Props extends PageProps {
  services: Service[];
}

import React, { useState } from "react";
import { Service } from "../../types/service";
import { ServiceCard } from "../../components/ServiceCard";
import Layout from "../../layouts/Layout";
import QuotationButton from "../../components/QuotationButton";
import ServiceShow from "./show";

export default function Servicios({ services }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <Layout
      heroContent={
        <div>
          <h1 className="text-4xl font-bold">Servicios</h1>
          <p className="mt-2 text-lg">
            Conoce todos los servicios que ofrecemos para ti
          </p>
        </div>
      }
    >
      <div className="flex h-[calc(100vh-12rem)]">
        {/* Lista de servicios a la derecha */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Lista de Servicios</h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => setSelectedService(service)}
              />
            ))}
          </ul>
        </div>

        {/* Panel de detalles a la izquierda */}
        {selectedService && (
          <div className="w-1/3 border-l bg-white shadow-lg">
            <ServiceShow service={selectedService} />
          </div>
        )}
      </div>
      <QuotationButton />
    </Layout>
  );
}
