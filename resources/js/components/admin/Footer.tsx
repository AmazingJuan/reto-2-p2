// resources/js/components/admin/Footer.tsx
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} Training Corporation. Todos los derechos reservados.</p>
        <div className="footer-links">

        </div>
      </div>
    </footer>
  );
};

export default Footer;
