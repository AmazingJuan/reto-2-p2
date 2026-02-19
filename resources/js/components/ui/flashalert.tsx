import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FlashAlertProps {
    flash: Record<string, unknown>;
    duration?: number;
}

export default function FlashAlert({ flash, duration = 5000 }: FlashAlertProps) {
    const success = typeof flash.success === 'string' ? flash.success : null;
    const error = typeof flash.error === 'string' ? flash.error : null;

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);
        }
    }, [flash]);

    // auto dismiss
    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [visible, duration]);

    if (!visible || (!success && !error)) return null;

    if (success) {
        return (
            <Alert className="relative mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>{success}</AlertDescription>

                <button onClick={() => setVisible(false)} className="absolute right-3 top-3 text-emerald-700 hover:opacity-70">
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive" className="relative mb-6 border-red-200 bg-red-50 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>

            <button onClick={() => setVisible(false)} className="absolute right-3 top-3 hover:opacity-70">
                <X className="h-4 w-4" />
            </button>
        </Alert>
    );
}
