import { draft } from '@/features/quotation-wizard/draft';
import { QuotationWizard } from '@/features/quotation-wizard/quotation-wizard';
import { QuoteShell } from '@/features/quotation-wizard/quote-shell';
import type { QuoteViewData } from '@/features/quotation-wizard/types';
import PublicLayout from '@/layouts/public-layout';
import { capitalize } from '@/lib/format';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function QuotationPage() {
    const { viewData, flash } = usePage<PageProps<{ viewData: QuoteViewData }>>().props;
    const unit = capitalize(viewData.businessUnit);
    // Also after a reload: the wizard keeps showing the confirmation of a request sent from this tab.
    const [sentBefore] = useState(() => draft.sent(viewData.unit) !== null);
    const sent = !!flash.quotation_sent || sentBefore;

    return (
        <PublicLayout title={`Cotizar ${unit.toLowerCase()}`} showCta={false}>
            <QuoteShell
                title={`Cotización de ${unit.toLowerCase()}`}
                crumb={unit}
                crumbs={[{ label: 'Solicitar cotización', href: route('quotation.select.business_unit') }]}
                lede={
                    sent
                        ? undefined
                        : 'Complete el formato de encuadre: la necesidad, las condiciones de prestación del servicio y los datos del cliente. Con esta información preparamos su propuesta.'
                }
                units={viewData.units}
                active={viewData.unit}
                // While the request is filled in the tabs would be a one-tap way out of it (the
                // wizard offers "Cambiar tipo de servicio"); once sent, the confirmation is the whole page.
                tabs={false}
            >
                <QuotationWizard key={viewData.unit} viewData={viewData} />
            </QuoteShell>
        </PublicLayout>
    );
}
