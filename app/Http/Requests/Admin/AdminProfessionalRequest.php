<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AdminProfessionalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:20000'],
            'years_experience' => ['required', 'integer', 'min:0', 'max:80'],
            'gestion_line_ids' => ['required', 'array', 'min:1'],
            'gestion_line_ids.*' => ['integer', Rule::exists('gestion_lines', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'summary.required' => 'El resumen es obligatorio.',
            'years_experience.required' => 'Los años de experiencia son obligatorios.',
            'years_experience.min' => 'Los años de experiencia no pueden ser negativos.',
            'years_experience.max' => 'Indique un valor de experiencia razonable (máx. 80).',
            'gestion_line_ids.required' => 'Seleccione al menos una línea de gestión.',
            'gestion_line_ids.min' => 'Seleccione al menos una línea de gestión.',
            'gestion_line_ids.*.exists' => 'Alguna línea de gestión no es válida.',
        ];
    }
}
