import { Service } from "../types/service";
import { X } from "lucide-react";

interface ServiceDetailsProps {
  service: Service;
  onClose: () => void;
}

export const ServiceDetails = ({ service, onClose }: ServiceDetailsProps) => {
  return (
    <div className="w-96 border-l bg-white shadow-xl p-6 overflow-y-auto rounded-l-2xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
          Detalles del Servicio
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Nombre */}
<h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>

{/* Información en tarjetas */}
<div className="mt-6 grid grid-cols-1 gap-4">
  {/* Descripción */}
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-xs font-medium text-gray-500 uppercase">
      Descripción
    </p>
    <p className="text-gray-700 mt-2 leading-relaxed">
      {service.description}
    </p>
  </div>

  {/* Línea de gestión */}
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-xs font-medium text-gray-500 uppercase">
      Línea de gestión
    </p>
    <p className="text-gray-900 font-semibold">
      {service.gestion_line}
    </p>
  </div>
</div>

    </div>
  );
};
