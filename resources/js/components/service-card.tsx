import { Service } from '../types/service';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  return (
    <li
      onClick={() => onSelect(service)}
      className="p-4 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
    >
      <h2 className="text-lg font-semibold">{service.name}</h2>
      <p className="text-gray-600 truncate">{service.description}</p>
    </li>
  );
};