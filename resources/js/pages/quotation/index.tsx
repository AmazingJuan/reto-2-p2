import GestionLine, { type ViewData } from '@/components/ui/tree/GestionLine';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

type QuotationPageProps = PageProps<{ viewData: ViewData }>;

export default function Index() {
    const { viewData } = usePage<QuotationPageProps>().props;

    return (
        <div className="min-h-screen overflow-x-hidden">
            <GestionLine viewData={viewData} />
        </div>
    );
}
