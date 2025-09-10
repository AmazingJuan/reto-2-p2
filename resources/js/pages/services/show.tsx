// ServiceShow page wrapper for service details modal
// Receives service data and onClose handler as props

import React from "react";
import { ServiceDetails } from "../../components/ServiceDetails";
import { Service } from "../../types/service";

// Props for ServiceShow component
interface Props {
  service: Service;
  onClose: () => void;
}

/**
 * ServiceShow
 * Renders the ServiceDetails modal for a given service
 */
export default function ServiceShow({ service, onClose }: Props) {
  // Render the ServiceDetails modal with provided service and close handler
  return <ServiceDetails service={service} onClose={onClose} />;
}
