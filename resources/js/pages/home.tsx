import { BrandRing, Ring } from '@/components/brand/brand-ring';
import { corporate } from '@/components/public/links';
import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';

const FACTS = [
    'Certificados en ISO 9001:2015 e ISO 45001:2018',
    'Miembro corporativo del Institute of Asset Management',
    'Servicios en 21 departamentos, Costa Rica y El Salvador',
];

const STEPS = [
    {
        title: 'Elija los servicios',
        text: 'Seleccione la unidad de negocio, la línea y los servicios que le interesan. Puede combinar varios en una sola solicitud.',
    },
    { title: 'Cuéntenos sobre su organización', text: 'Unas preguntas breves sobre su sector, tamaño y fechas nos permiten dimensionar el alcance.' },
    { title: 'Reciba la propuesta', text: 'Un consultor prepara la cotización y se la enviamos a su correo con un enlace seguro.' },
];

export default function Home() {
    return (
        <PublicLayout title="Cotizador" showCta={false}>
            <section className="frame grid items-center gap-12 pb-[clamp(2.75rem,2rem+3vw,5rem)] pt-[clamp(2rem,1rem+3vw,4.5rem)] lg:grid-cols-12 lg:gap-x-8">
                <div className="lg:col-span-7">
                    <h1 className="display max-w-[14ch] text-azul">Cotice su proyecto en línea</h1>
                    <p className="lede mt-7 text-pizarra">
                        Auditoría, consultoría y formación en sistemas de gestión. Cuéntenos qué necesita y le enviaremos una propuesta a la medida.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link href={route('quotation.select.business_unit')} className="btn btn-primary">
                            Solicitar una cotización
                        </Link>
                        <a href={corporate.portfolio} className="btn btn-outline">
                            Ver los servicios
                        </a>
                    </div>
                    <ul className="mt-10 grid gap-3 border-t border-linea pt-8 font-display text-[0.9375rem] font-semibold">
                        {FACTS.map((fact) => (
                            <li key={fact} className="flex items-baseline gap-3">
                                <span className="h-2 w-2 shrink-0 translate-y-[-0.1em] rounded-full bg-azul-vivo" aria-hidden />
                                {fact}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
                    <BrandRing
                        src="/images/fotos/curso-auditores-iso-55001-2020.jpg"
                        alt="Grupo de profesionales del curso de auditores ISO 55001"
                        focus="50% 40%"
                        caption="Curso de auditores en gestión de activos ISO 55001, 2020."
                    />
                </div>
            </section>

            <section className="field-azul section" aria-labelledby="pasos">
                <div className="frame">
                    <h2 id="pasos" className="heading max-w-[18ch]">
                        Así funciona su solicitud
                    </h2>
                    <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
                        {STEPS.map((step, index) => (
                            <li key={step.title}>
                                <span className="relative flex h-14 w-14 items-center justify-center font-display text-xl font-extrabold">
                                    <Ring tone="blanco" gap={18} className="absolute inset-0 h-full w-full" />
                                    {index + 1}
                                </span>
                                <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
                                <p className="mt-2 max-w-sm leading-relaxed">{step.text}</p>
                            </li>
                        ))}
                    </ol>
                    <Link href={route('quotation.select.business_unit')} className="btn btn-light mt-12">
                        Empezar ahora
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
