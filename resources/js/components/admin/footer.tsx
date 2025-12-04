import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Training Corporation. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {/* enlaces opcionales */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;