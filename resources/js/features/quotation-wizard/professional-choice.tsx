import { pluralize } from '@/lib/format';
import { useMemo, useState } from 'react';
import type { ProfessionalOption } from './types';

type ProfessionalChoiceProps = {
    professionals: ProfessionalOption[];
    selectedId: number | null;
    onChange: (id: number | null) => void;
};

/** Experience filter only pays off with a longer list. */
const FILTER_THRESHOLD = 6;

/** Optional, anonymised choice of a professional for the selected line. */
export function ProfessionalChoice({ professionals, selectedId, onChange }: ProfessionalChoiceProps) {
    const [minYears, setMinYears] = useState('');

    const visible = useMemo(() => {
        const min = Number.parseInt(minYears, 10);
        return Number.isNaN(min) ? professionals : professionals.filter((p) => p.years_experience >= min || p.id === selectedId);
    }, [professionals, minYears, selectedId]);

    const option = (id: number | null, title: string, detail?: string) => (
        <label key={id ?? 'none'} className="choice">
            <input
                type="radio"
                name="professional"
                checked={selectedId === id}
                onChange={() => onChange(id)}
                className="h-5 w-5 shrink-0 border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0"
            />
            <span>
                {title}
                {detail && <span className="block font-normal text-pizarra">{detail}</span>}
            </span>
        </label>
    );

    return (
        <fieldset>
            <legend className="label mb-1">
                Profesional preferido <span className="label-optional">(opcional)</span>
            </legend>
            <p className="hint max-w-measure">
                Por privacidad solo se muestran el número y la experiencia de cada profesional. Si no elige, asignaremos a quien mejor se ajuste.
            </p>

            {professionals.length > FILTER_THRESHOLD && (
                <label className="mt-4 flex max-w-xs items-center gap-3 text-base">
                    Experiencia mínima
                    <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={minYears}
                        onChange={(e) => setMinYears(e.target.value)}
                        className="control control-sm w-24"
                    />
                    años
                </label>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {option(null, 'Sin preferencia')}
                {visible.map((p) => option(p.id, `Profesional n.º ${p.id}`, `${pluralize(p.years_experience, 'año', 'años')} de experiencia`))}
            </div>
            {visible.length === 0 && <p className="hint mt-3">Nadie cumple esa experiencia mínima. Pruebe con un valor menor.</p>}
        </fieldset>
    );
}
