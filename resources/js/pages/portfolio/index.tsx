import Layout from "../../layouts/Layout";
import QuotationButton from "../../components/QuotationButton";
import { Link } from "@inertiajs/react";
import { route } from 'ziggy-js';
import React from "react";

interface ServicesObject {
  [slug: string]: string;
}

interface PortfolioIndexProps {
  services: ServicesObject;
  basePath?: string;
}

export default function PortfolioIndex({ services, basePath }: PortfolioIndexProps) {
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
          {Object.entries(services).map(([slug, name]) => (
            basePath ? (
              <Link
                key={slug}
                href={route(basePath, { serviceTypeId: slug })}
                className="block p-6 h-48 w-full border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-50"
              >
                {name}
              </Link>
            ) : null
          ))}
        </div>
      </div>
      <QuotationButton />
    </Layout>
  );
}