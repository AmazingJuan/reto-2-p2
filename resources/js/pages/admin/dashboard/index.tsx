import React from "react";
import { Link } from "@inertiajs/react";
import Header from "../../../components/admin/Header";
import Footer from "../../../components/admin/Footer";
import { route } from "ziggy-js";
import { Users, Wrench, GitBranch, ChevronRight } from "lucide-react";

const Dashboard: React.FC = () => {
  const items = [
    {
      label: "Usuarios",
      name: "admin.dashboard",
      desc: "Gestiona cuentas, roles y permisos",
      icon: Users,
      accent: "indigo",
    },
    {
      label: "Servicios",
      name: "admin.services.index",
      desc: "Crea y administra tus servicios",
      icon: Wrench,
      accent: "emerald",
    },
    {
      label: "Líneas de gestión",
      name: "admin.dashboard", 
      desc: "Organiza procesos y flujos",
      icon: GitBranch,
      accent: "amber",
    },
  ] as const;

  const badgeClasses: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100",
    amber: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="mx-auto mb-10 max-w-4xl text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Acceso rápido a los recursos de administración
          </p>
        </section>

        <section className="grid max-w-5xl mx-auto gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ label, name, desc, icon: Icon, accent }) => (
            <Link
              key={name}
              href={route(name)}
              className="group relative block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${badgeClasses[accent]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">
                    {label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {desc}
                  </p>
                </div>

                <ChevronRight className="ml-auto h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;