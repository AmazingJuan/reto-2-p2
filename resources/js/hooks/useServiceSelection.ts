import { useState } from 'react';
import { Service } from '../types/service';

export const useServiceSelection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const selectService = (service: Service) => {
    setSelectedService(service);
  };

  const clearSelection = () => {
    setSelectedService(null);
  };

  return {
    selectedService,
    selectService,
    clearSelection,
  };
};