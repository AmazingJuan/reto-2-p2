import { InputHTMLAttributes } from 'react';

export default function Checkbox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={'h-5 w-5 rounded border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0 ' + className}
        />
    );
}
