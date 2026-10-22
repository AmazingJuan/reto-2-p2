export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Localised short date (dd/mm/yyyy) or an em dash when missing/invalid. */
export function formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-CO');
}

/** `pluralize(3, 'año', 'años')` → "3 años". */
export function pluralize(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

/** Shown in tables and detail views for empty values. */
export function orDash(value?: string | number | null): string {
    return value === null || value === undefined || value === '' ? '—' : String(value);
}
