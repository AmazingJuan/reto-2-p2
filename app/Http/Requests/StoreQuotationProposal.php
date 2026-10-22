<?php

namespace App\Http\Requests;

use App\Models\Professional;
use App\Models\Service;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact' => ['required', 'array'],
            'contact.name' => ['required', 'string', 'max:255'],
            'contact.company' => ['nullable', 'string', 'max:255'],
            'contact.email' => ['required', 'email', 'max:255'],
            'contact.phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\s().-]{7,30}$/'],
            'contact.role' => ['nullable', 'string', 'max:255'],
            'privacy_accepted' => ['accepted'],

            'businessUnit' => ['required', 'string', 'max:255', Rule::exists('business_units', 'display_name')],
            // A request may combine services from several lines of the unit.
            'gestionLines' => ['required', 'array', 'min:1'],
            'gestionLines.*' => ['required', 'string', 'distinct', Rule::exists('gestion_lines', 'name')],

            'services' => ['required', 'array', 'min:1'],
            'services.*' => ['required', 'string', 'distinct', 'max:255'],

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

            'professional_id' => ['nullable', 'integer', 'exists:professionals,id'],
        ];
    }

    /**
     * Cross-field checks: the services must be offered by the chosen unit in
     * the chosen lines, and the professional must work in one of those lines.
     *
     * @return list<callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $lines = $this->input('gestionLines');
                $services = $this->input('services');

                $offered = Service::query()
                    ->whereIn('name', $services)
                    ->whereHas('businessUnit', fn ($q) => $q->where('display_name', $this->input('businessUnit')))
                    ->whereHas('gestionLine', fn ($q) => $q->whereIn('name', $lines))
                    ->count();

                if ($offered !== count($services)) {
                    $validator->errors()->add('services', 'Alguno de los servicios elegidos no está disponible. Recargue la página e intente de nuevo.');
                }

                $professionalId = $this->input('professional_id');
                if ($professionalId !== null && ! Professional::query()
                    ->whereKey($professionalId)
                    ->whereHas('gestionLines', fn ($q) => $q->whereIn('name', $lines))
                    ->exists()) {
                    $validator->errors()->add('professional_id', 'El profesional no está habilitado para las líneas elegidas.');
                }
            },
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
                if (is_string($k) && trim($k) === '') {
                    continue;
                }
                if (is_array($v) || is_object($v)) {
                    $trimmed[$k] = json_encode($v, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
                } elseif (is_string($v)) {
                    $trimmed[$k] = trim($v);
                } else {
                    $trimmed[$k] = trim((string) $v);
                }
            }
            $input['answers'] = $trimmed;
        }

        if (! $this->has('professional_id') || $this->input('professional_id') === '' || $this->input('professional_id') === null) {
            $input['professional_id'] = null;
        } else {
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
            'privacy_accepted.accepted' => 'Debe autorizar el tratamiento de sus datos para enviar la solicitud.',
            'contact.required' => 'El contacto es requerido.',
            'contact.array' => 'El contacto debe ser un objeto con nombre, email y teléfono.',

            'contact.name.required' => 'El nombre del contacto es requerido.',
            'contact.name.string' => 'El nombre del contacto debe ser texto.',
            'contact.name.max' => 'El nombre del contacto no debe exceder :max caracteres.',

            'contact.email.required' => 'El email del contacto es requerido.',
            'contact.email.email' => 'El email del contacto debe ser una dirección válida.',

            'contact.phone.required' => 'El teléfono del contacto es requerido.',
            'contact.phone.regex' => 'Por favor ingresa un teléfono válido.',

            'businessUnit.required' => 'La unidad de negocio es requerida.',
            'gestionLines.required' => 'Elija al menos una línea de gestión.',
            'gestionLines.*.exists' => 'Alguna de las líneas de gestión no es válida.',

            'services.required' => 'Debe seleccionar al menos un servicio.',
            'services.array' => 'Los servicios deben enviarse como una lista.',
            'services.*.required' => 'Cada servicio debe ser una cadena con nombre del servicio.',

            'answers.array' => 'Las respuestas deben enviarse como un diccionario pregunta=>respuesta.',
            'answers.*.required' => 'Cada respuesta es requerida.',
            'answers.*.string' => 'Cada respuesta debe ser texto.',
            'answers.*.max' => 'Cada respuesta no debe exceder :max caracteres.',

            'professional_id.exists' => 'El profesional seleccionado no es válido.',
        ];
    }
}
