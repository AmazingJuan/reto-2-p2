import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { UserForm } from '@/features/users/user-form';
import AdminLayout from '@/layouts/admin-layout';

export default function Create() {
    return (
        <AdminLayout title="Crear usuario">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.users.index')} label="Usuarios" />
                <AdminPageHeader title="Crear usuario" description="Las cuentas de usuario tienen acceso completo al panel." />
                <UserForm />
            </div>
        </AdminLayout>
    );
}
