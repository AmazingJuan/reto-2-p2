import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-slate-50 py-4 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.08)] sm:py-5 md:left-64 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
      <div className="container mx-auto max-w-full px-3 sm:px-4">
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-slate-600 sm:flex-row sm:gap-3">
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