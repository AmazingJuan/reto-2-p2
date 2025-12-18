<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminBusinessUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // permit form usage for both authenticated dashboard and public test routes
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Mensajes de validación en español.
     */
    public function messages(): array
    {
        return [
            'display_name.required' => 'El nombre es obligatorio.',
            'display_name.string' => 'El nombre debe ser un texto.',
            'display_name.max' => 'El nombre no puede superar los 255 caracteres.',
        ];
    }
}
