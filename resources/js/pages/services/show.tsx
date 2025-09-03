import React from "react";
import { ServiceDetails } from "../../components/ServiceDetails";
import { Service } from "../../types/service";

interface Props {
  service: Service;
}

export default function ServiceShow({ service }: Props) {
  return <ServiceDetails service={service} onClose={() => {}} />;
}
