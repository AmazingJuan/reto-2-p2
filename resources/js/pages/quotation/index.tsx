import { PageHeader } from '@/components/public/page-header';
import { QuotationWizard } from '@/features/quotation-wizard/quotation-wizard';
import type { QuoteViewData } from '@/features/quotation-wizard/types';
import PublicLayout from '@/layouts/public-layout';
import { capitalize } from '@/lib/format';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function QuotationPage() {
    const { viewData } = usePage<PageProps<{ viewData: QuoteViewData }>>().props;
    const unit = capitalize(viewData.businessUnit);

    return (
        <PublicLayout title={`Cotizar ${unit}`} showCta={false}>
            <PageHeader
                compact
                title={`Cotización de ${unit.toLowerCase()}`}
                crumb={unit}
                crumbs={[{ label: 'Solicitar cotización', href: route('quotation.select.business_unit') }]}
                lede="Agregue los servicios que necesita, responda unas preguntas y déjenos sus datos. Le enviaremos la propuesta por correo."
            />
            <QuotationWizard viewData={viewData} />
        </PublicLayout>
    );
}
