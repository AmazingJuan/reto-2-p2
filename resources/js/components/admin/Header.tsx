// resources/js/components/admin/Header.tsx
import React from "react";
import { LogOut } from "lucide-react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Panel de Administración</h1>

        <nav className="nav">
        </nav>

        <button className="logout-btn">
          <LogOut className="logout-icon" />
          Salir
        </button>
      </div>
    </header>
  );
};

export default Header;
