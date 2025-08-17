import { Service } from '../types/service';

interface ServiceDetailsProps {
  service: Service;
  onClose: () => void;
}

export const ServiceDetails = ({ service, onClose }: ServiceDetailsProps) => {
  return (
    <div className="w-96 border-l bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Detalles del Servicio</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <h3 className="text-lg font-semibold">{service.name}</h3>
      <p className="text-gray-700 mt-2">{service.description}</p>
      <p className="mt-4">
        <span className="font-semibold">Tipo:</span> {service.type}
      </p>
      <p>
        <span className="font-semibold">Línea de gestión:</span> {service.gestion_line}
      </p>
    </div>
  );
};