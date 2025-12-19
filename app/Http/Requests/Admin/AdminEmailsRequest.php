<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AdminEmailsRequest extends FormRequest
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
            'emails' => ['sometimes', 'required', 'array', 'min:1'],
            'emails.*' => ['required', 'email', 'distinct', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'emails.required' => 'Debe enviar al menos un correo electrónico.',
            'emails.array' => 'El campo de correos debe ser un arreglo.',
            'emails.*.email' => 'Uno de los correos no tiene un formato válido.',
            'emails.*.distinct' => 'Hay correos electrónicos repetidos en la lista.',
            'emails.*.max' => 'Cada correo no puede superar los 255 caracteres.',
        ];
    }
}