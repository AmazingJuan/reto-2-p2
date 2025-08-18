//This archive defines the base of all archives .tsx involved in the view of the page
import React, { PropsWithChildren, ReactNode } from "react";
import { Link } from "@inertiajs/react"; // si usas Inertia

interface LayoutProps extends PropsWithChildren {
  heroContent?: ReactNode; // para poder inyectar texto/elementos en el banner azul
}

export default function Layout({ children, heroContent }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="bg-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Inicio */}
          <div className="flex items-center space-x-6">
            <img
              src="/images/logo.png"
              alt="Training Corporation"
              className="h-12"
            />
            <Link href="/" className="font-bold text-blue-900">
              INICIO
            </Link>
          </div>

          {/* Portafolio */}
          <Link
            href="/servicios"
            className="px-4 py-2 border border-blue-900 text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition rounded"
          >
            Portafolio de Servicios
          </Link>

          {/* Buscador */}
          <div className="flex items-center border border-gray-400 rounded px-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="px-2 py-1 outline-none"
            />
            <span className="text-gray-600">🔍</span>
          </div>
        </div>
      </header>

      {/* HERO / BANNER AZUL */}
      <section className="bg-gradient-to-r from-blue-900 to-gray-800 text-white py-16 text-center">
        {heroContent ? (
          heroContent
        ) : (
          <h1 className="text-3xl font-bold">tuki</h1>
        )}
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#151528] text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-gray-300">
            Training Corporation - 2025
          </span>
        </div>
      </footer>
    </div>
  );
}
