<?php

namespace App\Http\Requests\Admin;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateQuotationUrlRequest extends FormRequest
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
            'quotation_url' => ['required', 'string', 'max:2048', 'url'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'quotation_url.required' => 'La URL de la cotización es obligatoria.',
            'quotation_url.string' => 'La URL debe ser una cadena de texto.',
            'quotation_url.max' => 'La URL no puede exceder los 2048 caracteres.',
            'quotation_url.url' => 'La URL debe ser una dirección válida.',
        ];
    }
}
