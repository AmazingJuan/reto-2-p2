import { FormActions, FormCard, FormField } from '@/components/admin/form';
import { adminFieldInputClass } from '@/components/admin/styles';
import type { GestionLineOption } from '@/features/catalog/types';
import { capitalize } from '@/lib/format';
import { useForm } from '@inertiajs/react';
import type { Professional } from './types';

type ProfessionalFormProps = {
    professional?: Professional;
    gestionLines: GestionLineOption[];
};

export function ProfessionalForm({ professional, gestionLines }: ProfessionalFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: professional?.name ?? '',
        summary: professional?.summary ?? '',
        years_experience: professional ? String(professional.years_experience) : '',
        gestion_line_ids: professional?.gestion_lines.map((line) => line.id) ?? [],
    });

    const toggleLine = (id: number) =>
        setData(
            'gestion_line_ids',
            data.gestion_line_ids.includes(id) ? data.gestion_line_ids.filter((x) => x !== id) : [...data.gestion_line_ids, id],
        );

    const submit = () =>
        professional ? put(route('dashboard.professionals.update', professional.id)) : post(route('dashboard.professionals.store'));

    // Laravel reports array item errors as "gestion_line_ids.0"; show the first one.
    const linesError = errors.gestion_line_ids ?? Object.entries(errors).find(([key]) => key.startsWith('gestion_line_ids.'))?.[1];

    return (
        <FormCard onSubmit={submit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_12rem]">
                <FormField id="name" label="Nombre" required error={errors.name} hint="Solo visible para administradores.">
                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={adminFieldInputClass} />
                </FormField>
                <FormField id="years_experience" label="Años de experiencia" required error={errors.years_experience} hint="Visible para el cliente.">
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={80}
                        value={data.years_experience}
                        onChange={(e) => setData('years_experience', e.target.value)}
                        className={adminFieldInputClass}
                    />
                </FormField>
            </div>

            <fieldset aria-describedby="lines-hint">
                <legend className="label mb-1">Líneas de gestión</legend>
                <p id="lines-hint" className="hint mb-3">
                    El profesional solo se ofrecerá cuando el cliente elija una de estas líneas.
                </p>
                {gestionLines.length === 0 ? (
                    <p className="rounded-control bg-nube px-4 py-3 text-sm text-pizarra">No hay líneas de gestión en el sistema.</p>
                ) : (
                    <div className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto rounded-control border-2 border-linea p-2 sm:grid-cols-2">
                        {gestionLines.map((line) => (
                            <label
                                key={line.id}
                                className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm text-tinta hover:bg-nube"
                            >
                                <input
                                    type="checkbox"
                                    checked={data.gestion_line_ids.includes(line.id)}
                                    onChange={() => toggleLine(line.id)}
                                    className="h-4 w-4 rounded border-linea text-azul focus:ring-azul"
                                />
                                {capitalize(line.name)}
                            </label>
                        ))}
                    </div>
                )}
                {linesError && (
                    <p className="mt-1.5 text-sm text-error" role="alert">
                        {linesError}
                    </p>
                )}
            </fieldset>

            <FormField id="summary" label="Resumen" required error={errors.summary} hint="Perfil del profesional. Solo visible para administradores.">
                <textarea rows={7} value={data.summary} onChange={(e) => setData('summary', e.target.value)} className={adminFieldInputClass} />
            </FormField>

            <FormActions
                processing={processing}
                submitLabel={professional ? 'Guardar cambios' : 'Crear profesional'}
                cancelHref={route('dashboard.professionals.index')}
            />
        </FormCard>
    );
}
