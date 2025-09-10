import React, { PropsWithChildren, ReactNode } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LayoutProps extends PropsWithChildren {
  heroContent?: ReactNode; // para poder inyectar texto/elementos en el banner azul
}

export default function Layout({ children, heroContent }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar y Header*/}
      <Header />
      
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">{children}</main>

  {/* PIE DE PÁGINA*/}
  <Footer />
    </div>
  );
}