export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl">
            {/* Línea decorativa gradiente superior (esmeralda) */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
            
            <div className="container mx-auto flex h-16 items-center justify-center px-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>© 2026 Training Corporation.</span>
                    <span className="hidden text-slate-400 sm:inline">|</span>
                    <span className="hidden sm:inline">Todos los derechos reservados.</span>
                </div>
            </div>
        </footer>
    );
}