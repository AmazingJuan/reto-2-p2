<?php

namespace App\Http\Requests\Admin;

use App\Models\Configuration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AdminConfigurationUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>>
     */
    public function rules(): array
    {
        $rules = [];
        foreach ((new Configuration)->getFillable() as $field) {
            $rules[$field] = match ($field) {
                'notification_email' => ['nullable', 'email', 'max:255'],
                'company_contact_email' => ['nullable', 'email', 'max:255'],
                'company_contact_phone' => ['nullable', 'string', 'max:64'],
                'company_contact_address' => ['nullable', 'string', 'max:2000'],
                'company_website_url' => ['nullable', 'string', 'max:512'],
                'company_website_label' => ['nullable', 'string', 'max:255'],
                default => ['nullable', 'string', 'max:255'],
            };
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'notification_email.email' => 'El correo de notificaciones debe ser una dirección válida.',
            'notification_email.max' => 'El correo no puede superar los :max caracteres.',
            'company_contact_email.email' => 'El correo de contacto debe ser una dirección válida.',
            'company_contact_phone.max' => 'El teléfono no puede superar los :max caracteres.',
            'company_contact_address.max' => 'La dirección no puede superar los :max caracteres.',
            'company_website_url.max' => 'La URL del sitio web no puede superar los :max caracteres.',
        ];
    }
}
