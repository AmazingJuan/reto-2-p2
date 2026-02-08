import { Link, usePage } from '@inertiajs/react';

const routeNameMap: Record<string, string> = {
  dashboard: 'Panel',
  'portafolio-de-servicios': 'Portafolio de servicios',
  servicios: 'Servicios',
  perfil: 'Perfil',
  // Agrega más rutas personalizadas aquí si lo deseas
};

export default function Breadcrumbs() {
  const { url } = usePage();
  const segments = url.split('/').filter(Boolean);

  return (
    <nav className="flex items-center justify-center gap-2 text-lg text-white">
      <Link
        href={route('home')}
        className="font-semibold text-white"
      >
        Inicio
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const displayName = routeNameMap[segment] || segment.replace('-', ' ');
        return (
          <span key={index} className="flex items-center gap-2">
            <span className="mx-2 text-white">→</span>
            {isLast ? (
              <span className="font-semibold text-white uppercase">
                {displayName}
              </span>
            ) : (
              <Link href={href} className="font-semibold text-white">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
