// PortfolioIndex page for listing service types in the portfolio

import Layout from "../../layouts/Layout";
import QuotationButton from "../../components/QuotationButton";
import { Link } from "@inertiajs/react";
import { route } from 'ziggy-js';
import React from "react";

// ServicesObject: maps service type slug to display name
interface ServicesObject {
  [slug: string]: string;
}

// Props for PortfolioIndex component
interface PortfolioIndexProps {
  services: ServicesObject;
  basePath?: string;
}

/**
 * PortfolioIndex
 * Lists all service types in the portfolio as cards/links
 */
export default function PortfolioIndex({ services, basePath }: PortfolioIndexProps) {
  return (
    <Layout
      // Hero section at the top of the page
      heroContent={
        <div>
          <h1 className="text-4xl font-bold">Portafolio de servicios</h1>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Render a card for each service type */}
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
    </Layout>
  );
}