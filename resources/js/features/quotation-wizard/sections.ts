/** The blocks of the "formato de encuadre", in the order the client goes through them. */
export const SECTIONS = [
    {
        key: 'necesidad',
        title: 'Identificación de la necesidad',
        short: 'Necesidad',
        hint: 'Qué servicio requiere y cuáles son sus características.',
    },
    {
        key: 'condiciones',
        title: 'Condiciones de prestación del servicio',
        short: 'Condiciones',
        hint: 'Modalidad, lugar, horario, fecha y logística.',
    },
    {
        key: 'cotizacion',
        title: 'Información para la cotización',
        short: 'Cotización',
        hint: 'Insumos técnicos y económicos para estructurar la oferta.',
    },
    { key: 'validacion', title: 'Validación de requisitos', short: 'Validación', hint: 'Cómo resolver dudas antes de preparar la propuesta.' },
    { key: 'cierre', title: 'Cierre de la solicitud', short: 'Cierre', hint: 'Plazo en que espera recibir la oferta comercial.' },
] as const;

export type SectionKey = (typeof SECTIONS)[number]['key'];

export const sectionOf = (key: string | null) => SECTIONS.find((s) => s.key === key) ?? null;
