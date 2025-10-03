import React from "react";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">
          Panel de Administración
        </h1>

        <nav className="hidden sm:flex items-center gap-4">
          {/* enlaces opcionales */}
        </nav>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>
    </header>
  );
};

export default Header;