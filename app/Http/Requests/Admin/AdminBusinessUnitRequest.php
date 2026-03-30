<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AdminBusinessUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('abbreviation')) {
            $abbr = strtoupper(preg_replace('/\s+/', '', trim((string) $this->input('abbreviation', ''))));
            $this->merge(['abbreviation' => $abbr]);
        }
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>>
     */
    public function rules(): array
    {
        $uniqueAbbrev = Rule::unique('business_units', 'abbreviation');
        $routeId = $this->route('id');
        if ($routeId !== null && $routeId !== '') {
            $uniqueAbbrev = $uniqueAbbrev->ignore((int) $routeId);
        }

        return [
            'display_name' => ['required', 'string', 'max:255'],
            'abbreviation' => ['required', 'string', 'min:2', 'max:32', 'regex:/^[A-Z0-9]+$/', $uniqueAbbrev],
        ];
    }

    public function messages(): array
    {
        return [
            'display_name.required' => 'El nombre es obligatorio.',
            'display_name.string' => 'El nombre debe ser un texto.',
            'display_name.max' => 'El nombre no puede superar los 255 caracteres.',
            'abbreviation.required' => 'El abreviado es obligatorio.',
            'abbreviation.min' => 'Use al menos 2 caracteres en el abreviado.',
            'abbreviation.max' => 'El abreviado no puede superar los 32 caracteres.',
            'abbreviation.regex' => 'El abreviado solo puede incluir letras mayúsculas y números, sin espacios.',
            'abbreviation.unique' => 'Ese abreviado ya está en uso por otra unidad de negocio.',
        ];
    }
}
