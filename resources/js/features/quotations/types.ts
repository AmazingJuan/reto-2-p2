export interface ClientSummary {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    role?: string | null;
    nit?: string | null;
    economic_activity?: string | null;
    address?: string | null;
}

export interface QuotationDocument {
    id: number;
    /** Key of the answer (question) it was attached in. */
    question: string;
    original_name: string;
    mime_type: string | null;
    size: number;
}

export interface QuotationOrder {
    id: string;
    quotation_code: string | null;
    client: ClientSummary | null;
    business_unit: string;
    gestion_line?: string | null;
    services?: string[];
    answers?: Record<string, string>;
    /** Loaded in the detail page. */
    documents?: QuotationDocument[];
    is_generated: boolean;
    viewed_by_client: boolean;
    quotation_url: string | null;
    created_at: string;
}

export const quotationTitle = (order: Pick<QuotationOrder, 'id' | 'quotation_code'>) =>
    order.quotation_code ? `Cotización ${order.quotation_code}` : 'Cotización sin código';
