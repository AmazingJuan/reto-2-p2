import { FormActions, FormCard, FormField } from '@/components/admin/form';
import { adminFieldInputClass } from '@/components/admin/styles';
import { capitalize } from '@/lib/format';
import { useForm } from '@inertiajs/react';

export type ServiceFormProps = {
    service?: { id: number; name: string; business_unit_id: number; gestion_line_id: number };
    businessUnits: { id: number; display_name: string }[];
    gestionLines: { id: number; name: string }[];
};

export function ServiceForm({ service, businessUnits, gestionLines }: ServiceFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: service?.name ?? '',
        business_unit_id: service ? String(service.business_unit_id) : '',
        gestion_line_id: service ? String(service.gestion_line_id) : '',
    });

    const submit = () => (service ? put(route('dashboard.services.update', service.id)) : post(route('dashboard.services.store')));

    return (
        <FormCard onSubmit={submit}>
            <FormField id="name" label="Nombre" required error={errors.name}>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={adminFieldInputClass}
                    placeholder="Nombre del servicio"
                />
            </FormField>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField id="business_unit_id" label="Unidad de negocio" required error={errors.business_unit_id}>
                    <select
                        value={data.business_unit_id}
                        onChange={(e) => setData('business_unit_id', e.target.value)}
                        className={adminFieldInputClass}
                    >
                        <option value="">Seleccione…</option>
                        {businessUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {capitalize(unit.display_name)}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField id="gestion_line_id" label="Línea de gestión" required error={errors.gestion_line_id}>
                    <select
                        value={data.gestion_line_id}
                        onChange={(e) => setData('gestion_line_id', e.target.value)}
                        className={adminFieldInputClass}
                    >
                        <option value="">Seleccione…</option>
                        {gestionLines.map((line) => (
                            <option key={line.id} value={line.id}>
                                {capitalize(line.name)}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            <FormActions
                processing={processing}
                submitLabel={service ? 'Guardar cambios' : 'Crear servicio'}
                cancelHref={route('dashboard.services.index')}
            />
        </FormCard>
    );
}
