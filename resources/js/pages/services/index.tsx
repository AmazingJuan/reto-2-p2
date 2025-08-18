import Layout from "../../layouts/Layout";
import { Link } from "@inertiajs/react";
import React, { PropsWithChildren, ReactNode } from "react";

interface Service {
  name: string;
  slug: string;
}

interface ServicesIndexProps {
  services: Service[]; // vendrá de Laravel
}

interface LayoutProps extends PropsWithChildren {
  heroContent?: ReactNode;
}

export default function ServicesIndex({ services }: ServicesIndexProps) {
  return (
    <Layout
      heroContent={
        <div>
          <h1 className="text-4xl font-bold">Portafolio de servicios</h1>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/portafolio/${service.slug}`}
              className="block p-6 h-48 w-full border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-50"
            >
              {service.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
