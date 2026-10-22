import type { ClientSummary } from '@/features/quotations/types';

export interface ClientWithStats extends ClientSummary {
    quotations_count: number;
    generated_count: number;
    pending_count: number;
    first_quotation_at?: string | null;
    last_quotation_at?: string | null;
}

export type ClientFilters = { search: string; company: string; business_unit: string };
