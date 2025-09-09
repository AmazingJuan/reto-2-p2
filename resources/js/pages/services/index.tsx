import React, { useState } from "react";
import { Service } from "../../types/service";
import { ServiceCard } from "../../components/ServiceCard";
import Layout from "../../layouts/Layout";
import QuotationButton from "../../components/QuotationButton";
import ServiceShow from "./show";
import { Search, X } from "lucide-react";
import { route } from "ziggy-js";
import { Inertia } from "@inertiajs/inertia";


interface Props {
  services: Service[];
  serviceTypeId: number;
  searchQuery?: string;
}

export default function Servicios({ services, serviceTypeId, searchQuery }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!searchTerm.trim()) {
    // Si la barra está vacía, vuelve a cargar todos los servicios
    Inertia.get(route("services.index", { serviceTypeId }));
    return;
  }

  // Si hay texto, aplica el filtro
  Inertia.get(route("services.index", { serviceTypeId, search: searchTerm }));
};

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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lista de Servicios {viewData.serviceType}</h2>
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="h-6 w-6 text-gray-600" />
              </button>
            ) : (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white border border-gray-300 rounded-full shadow px-3 py-1 w-72 transition-all"
              >
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 flex-1 outline-none text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <ul className="space-y-2">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={() => setSelectedService(service)}
                />
              ))
            ) : (
              <p className="text-gray-500 italic text-center mt-10">
                No se han encontrado servicios. Intente de nuevo con otra búsqueda
              </p>
            )}
          </ul>
        </div>

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
