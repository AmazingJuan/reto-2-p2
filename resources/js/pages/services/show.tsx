import React from "react";
import { ServiceDetails } from "../../components/ServiceDetails";
import { Service } from "../../types/service";

interface Props {
  service: Service;
  onClose: () => void;
}

export default function ServiceShow({ service, onClose }: Props) {
  return <ServiceDetails service={service} onClose={onClose} />;
}
