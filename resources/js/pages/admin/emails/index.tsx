import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { useForm } from '@inertiajs/react';
import React, { ChangeEvent, useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface EmailListState {
    emailInput: string;
    error: string | null;
}

const SendEmailCampaign: React.FC = () => {
    const [state, setState] = useState<EmailListState>({
        emailInput: '',
        error: null,
    });

    const { data, setData, post, processing } = useForm({
        emails: [] as string[],
    });

    // Agregar correo a la lista
    const handleAddEmail = () => {
        const email = state.emailInput.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setState((prev) => ({ ...prev, error: 'Por favor ingresa un correo válido.' }));
            return;
        }

        if (data.emails.includes(email)) {
            setState((prev) => ({ ...prev, error: 'Este correo ya está en la lista.' }));
            return;
        }

        setData('emails', [...data.emails, email]);
        setState({
            emailInput: '',
            error: null,
        });
    };

    // Remover correo de la lista
    const handleRemoveEmail = (index: number) => {
        setData(
            'emails',
            data.emails.filter((_, i) => i !== index),
        );
    };

    // Permitir agregar correo con Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    // Enviar formulario
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.emails.length === 0) {
            setState((prev) => ({ ...prev, error: 'Agrega al menos un correo.' }));
            return;
        }

        post(route('dashboard.emails.store'));
    };


    return (
        <div className="px-4 py-8 mt-24">
            <Header />
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">Enviar Campaña de Correos</h1>
                    <p className="text-lg text-gray-600">Ingresa los correos a los que deseas enviar el mensaje</p>
                </div>

                {/* Error Message */}
                {state.error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
                        <svg className="mt-0.5 h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-medium">{state.error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Formulario - Izquierda */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                            <h2 className="mb-6 text-xl font-bold text-gray-800">Agregar Correos</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Nuevo Correo</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="email"
                                            value={state.emailInput}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                setState((prev) => ({ ...prev, emailInput: e.target.value, error: null }))
                                            }
                                            onKeyPress={handleKeyPress}
                                            placeholder="ejemplo@correo.com"
                                            className="rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddEmail}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Agregar
                                        </button>
                                    </div>
                                    <p className="mt-3 text-xs text-gray-500">
                                        💡 Presiona Enter para agregar rápidamente Por favor, tener paciencia si se envian a varios correos al mismo
                                        tiempo
                                    </p>
                                    <p className="mt-3 text-xs text-gray-500">
                                        Por favor, tener paciencia si se envian a varios correos al mismo tiempo
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing || data.emails.length === 0}
                                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                                            processing || data.emails.length === 0
                                                ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                                                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="h-5 w-5 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Enviar a {data.emails.length}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Correos - Derecha */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Correos en la Lista</h2>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                                    {data.emails.length} correo{data.emails.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {data.emails.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {data.emails.map((email, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </div>
                                                <span className="truncate text-sm font-medium text-gray-700">{email}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEmail(index)}
                                                className="ml-2 flex-shrink-0 rounded p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
                                                title="Remover"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="font-medium text-gray-500">No hay correos agregados</p>
                                    <p className="text-sm text-gray-400">Agrega correos para comenzar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mx-auto mt-8 max-w-6xl">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h3 className="mb-3 flex items-center gap-2 font-bold text-blue-900">
                            <span className="text-xl">💡</span>
                            Información
                        </h3>
                        <div className="grid grid-cols-1 gap-4 text-sm text-blue-800 md:grid-cols-2">
                            <div>
                                <p>✓ Presiona Enter para agregar correos rápidamente</p>
                            </div>
                            <div>
                                <p>✓ Valida automáticamente el formato del correo</p>
                            </div>
                            <div>
                                <p>✓ Evita duplicados en la lista</p>
                            </div>
                            <div>
                                <p>✓ Los correos se enviarán usando la plantilla configurada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SendEmailCampaign;
