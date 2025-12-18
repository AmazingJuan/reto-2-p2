import GoHome from '@/components/ui/gohome';
import GestionLine from '@/components/ui/tree/GestionLine';
import { usePage } from '@inertiajs/react';

export default function Index() {
    const { viewData } = usePage().props as any;

    return (
        <div>
            <GestionLine viewData={viewData} />
        </div>
    );
}
