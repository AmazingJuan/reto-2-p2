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
                'application_url' => ['nullable', 'string', 'max:2048'],
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
            'application_url.max' => 'La URL no puede superar los :max caracteres.',
        ];
    }
}
