<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AdminServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'business_unit_id' => ['required', 'exists:business_units,id'],
            'gestion_line_id' => ['required', 'exists:gestion_lines,id'],
        ];
    }

    /**
     * Mensajes de validación en español.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede superar los 255 caracteres.',

            'description.string' => 'La descripción debe ser un texto.',

            'business_unit_id.required' => 'La unidad de negocio es obligatoria.',
            'business_unit_id.exists' => 'La unidad de negocio seleccionada no es válida.',

            'gestion_line_id.required' => 'La línea de gestión es obligatoria.',
            'gestion_line_id.exists' => 'La línea de gestión seleccionada no es válida.',
        ];
    }
}
