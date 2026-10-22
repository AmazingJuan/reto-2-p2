import { cn } from '@/lib/utils';
import { adminFieldInputClass } from './styles';

type FilterSelectProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    allLabel: string;
    options: { value: string; label: string }[];
};

/** Labelled select used next to the search box in listings. */
export function FilterSelect({ id, label, value, onChange, allLabel, options }: FilterSelectProps) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-1 sm:w-52">
            <label htmlFor={id} className="text-xs font-semibold text-pizarra">
                {label}
            </label>
            <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(adminFieldInputClass, 'cursor-pointer')}>
                <option value="">{allLabel}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
