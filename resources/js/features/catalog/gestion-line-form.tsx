import { FormActions, FormCard, FormField } from '@/components/admin/form';
import { adminFieldInputClass } from '@/components/admin/styles';
import { useForm } from '@inertiajs/react';

export function GestionLineForm({ gestionLine }: { gestionLine?: { id: number; name: string } }) {
    const { data, setData, post, put, processing, errors } = useForm({ name: gestionLine?.name ?? '' });

    const submit = () => (gestionLine ? put(route('dashboard.lines.update', gestionLine.id)) : post(route('dashboard.lines.store')));

    return (
        <FormCard onSubmit={submit}>
            <FormField id="name" label="Nombre" required error={errors.name} hint="Así se mostrará al cliente al elegir la línea de gestión.">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={adminFieldInputClass}
                    placeholder="Ej.: Calidad"
                />
            </FormField>
            <FormActions
                processing={processing}
                submitLabel={gestionLine ? 'Guardar cambios' : 'Crear línea'}
                cancelHref={route('dashboard.lines.index')}
            />
        </FormCard>
    );
}
