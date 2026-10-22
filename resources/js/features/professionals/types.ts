export interface Professional {
    id: number;
    name: string;
    summary: string;
    years_experience: number;
    gestion_lines: { id: number; name?: string }[];
}
