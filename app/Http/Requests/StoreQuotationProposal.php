<?php

namespace App\Http\Requests;

use App\Models\Professional;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuotationProposal extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact' => ['required', 'array'],
            'contact.name' => ['required', 'string', 'max:255'],
            'contact.company' => ['nullable', 'string', 'max:255'],
            'contact.email' => ['required', 'email', 'max:255'],
            'contact.phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\s().-]{7,30}$/'],
            'contact.role' => ['required', 'string', 'max:255'],

            'businessUnit' => ['required', 'string', 'max:255'],
            'gestionLine' => ['required', 'string', 'max:255'],

            'services' => ['required', 'array', 'min:1'],
            'services.*' => ['required', 'string', 'max:255'],

            'answers' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    foreach ($value as $k => $v) {
                        if (! is_string($k) || trim($k) === '') {
                            $fail('Las claves de '.$attribute.' deben ser cadenas no vacías.');

                            return;
                        }
                    }
                },
            ],
            'answers.*' => ['required', 'string', 'max:1000'],

            'professional_id' => [
                Rule::requiredIf(fn () => Professional::query()->exists()),
                'nullable',
                'integer',
                'exists:professionals,id',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $input = $this->all();

        if ($contact = $this->input('contact')) {
            $contact = array_map(function ($v) {
                return is_string($v) ? trim($v) : $v;
            }, $contact);

            if (isset($contact['phone'])) {
                $phone = preg_replace('/[^0-9+]/', '', $contact['phone']);
                $contact['phone'] = $phone;
            }

            $input['contact'] = $contact;
        }

        if ($services = $this->input('services')) {
            $input['services'] = array_values(array_map(function ($v) {
                return is_string($v) ? trim($v) : $v;
            }, $services));
        }

        if ($answers = $this->input('answers')) {
            $trimmed = [];
            foreach ($answers as $k => $v) {
                $trimmed[$k] = is_string($v) ? trim($v) : $v;
            }
            $input['answers'] = $trimmed;
        }

        if ($this->has('professional_id') && $this->input('professional_id') !== '' && $this->input('professional_id') !== null) {
            $input['professional_id'] = (int) $this->input('professional_id');
        }

        $this->replace($input);
    }

    /**
     * Custom error messages for validation failures.
     *
     * @return array<string,string>
     */
    public function messages(): array
    {
        return [
            'contact.required' => 'El contacto es requerido.',
            'contact.array' => 'El contacto debe ser un objeto con nombre, email y teléfono.',

            'contact.name.required' => 'El nombre del contacto es requerido.',
            'contact.name.string' => 'El nombre del contacto debe ser texto.',
            'contact.name.max' => 'El nombre del contacto no debe exceder :max caracteres.',

            'contact.email.required' => 'El email del contacto es requerido.',
            'contact.email.email' => 'El email del contacto debe ser una dirección válida.',

            'contact.phone.required' => 'El teléfono del contacto es requerido.',
            'contact.phone.regex' => 'El teléfono contiene caracteres inválidos.',

            'businessUnit.required' => 'La unidad de negocio es requerida.',
            'gestionLine.required' => 'La línea de gestión es requerida.',

            'services.required' => 'Debe seleccionar al menos un servicio.',
            'services.array' => 'Los servicios deben enviarse como una lista.',
            'services.*.required' => 'Cada servicio debe ser una cadena con nombre del servicio.',

            'answers.array' => 'Las respuestas deben enviarse como un diccionario pregunta=>respuesta.',
            'answers.*.required' => 'Cada respuesta es requerida.',
            'answers.*.string' => 'Cada respuesta debe ser texto.',
            'answers.*.max' => 'Cada respuesta no debe exceder :max caracteres.',

            'professional_id.required' => 'Debe elegir un profesional para continuar.',
            'professional_id.exists' => 'El profesional seleccionado no es válido.',
        ];
    }
}
