import { QuotationWizard } from '@/features/quotation-wizard/quotation-wizard';
import { QuoteShell } from '@/features/quotation-wizard/quote-shell';
import type { QuoteViewData } from '@/features/quotation-wizard/types';
import PublicLayout from '@/layouts/public-layout';
import { capitalize } from '@/lib/format';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function QuotationPage() {
    const { viewData, flash } = usePage<PageProps<{ viewData: QuoteViewData }>>().props;
    const unit = capitalize(viewData.businessUnit);
    const sent = !!flash.quotation_sent;

    return (
        <PublicLayout title={`Cotizar ${unit.toLowerCase()}`} showCta={false}>
            <QuoteShell
                title={`Cotización de ${unit.toLowerCase()}`}
                crumb={unit}
                crumbs={[{ label: 'Solicitar cotización', href: route('quotation.select.business_unit') }]}
                lede={
                    sent
                        ? undefined
                        : 'Complete el formato de encuadre: sus datos, qué necesita y en qué condiciones. Con esto preparamos su propuesta.'
                }
                units={viewData.units}
                active={viewData.unit}
                // Once sent, the confirmation is the whole page.
                tabs={!sent}
            >
                <QuotationWizard key={viewData.unit} viewData={viewData} />
            </QuoteShell>
        </PublicLayout>
    );
}
