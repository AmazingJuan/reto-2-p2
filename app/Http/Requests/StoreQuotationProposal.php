<?php

namespace App\Http\Requests;

use App\Models\QuotationDocument;
use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact' => ['required', 'array'],
            'contact.name' => ['required', 'string', 'max:255'],
            'contact.company' => ['required', 'string', 'max:255'],
            'contact.nit' => ['nullable', 'string', 'max:30'],
            'contact.economic_activity' => ['nullable', 'string', 'max:255'],
            'contact.address' => ['nullable', 'string', 'max:255'],
            'contact.email' => ['required', 'email', 'max:255'],
            'contact.phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\s().-]{7,30}$/'],
            'contact.role' => ['required', 'string', 'max:255'],
            'privacy_accepted' => ['accepted'],
            // Honeypot, hidden from people (see QuotationController).
            'web' => ['nullable', 'string', 'max:255'],

            'businessUnit' => ['required', 'string', 'max:255', Rule::exists('business_units', 'display_name')],

            // The encuadre: readable answers keyed by question.
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
            // Open questions of the encuadre (descriptions) can be long.
            'answers.*' => ['required', 'string', 'max:5000'],

            // Documents attached in the encuadre's file questions, each with the answer it belongs to.
            'documents' => ['nullable', 'array', 'max:'.QuotationDocument::MAX_FILES],
            'documents.*' => ['array:question,file'],
            'documents.*.question' => ['required', 'string', Rule::in(array_keys((array) $this->input('answers', [])))],
            'documents.*.file' => ['required', 'file', 'max:'.QuotationDocument::MAX_KILOBYTES, 'extensions:'.implode(',', QuotationDocument::EXTENSIONS)],
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

            'contact.company.required' => 'Escriba la razón social de su organización.',
            'contact.role.required' => 'Escriba su cargo.',

            'contact.email.required' => 'El email del contacto es requerido.',
            'contact.email.email' => 'El email del contacto debe ser una dirección válida.',

            'contact.phone.required' => 'El teléfono del contacto es requerido.',
            'contact.phone.regex' => 'Por favor ingresa un teléfono válido.',

            'businessUnit.required' => 'La unidad de negocio es requerida.',

            'answers.array' => 'Las respuestas deben enviarse como un diccionario pregunta=>respuesta.',
            'answers.*.required' => 'Cada respuesta es requerida.',
            'answers.*.string' => 'Cada respuesta debe ser texto.',
            'answers.*.max' => 'Cada respuesta no debe exceder :max caracteres.',

            'documents.max' => 'Adjunte máximo :max documentos.',
            'documents.*.question.in' => 'Uno de los documentos no corresponde a ninguna pregunta de la solicitud.',
            'documents.*.file.required' => 'Uno de los documentos no se pudo subir. Inténtelo de nuevo.',
            'documents.*.file.file' => 'Uno de los documentos no se pudo subir. Inténtelo de nuevo.',
            'documents.*.file.uploaded' => 'Uno de los documentos no se pudo subir: revise que pese menos de '.(QuotationDocument::MAX_KILOBYTES / 1024).' MB.',
            'documents.*.file.max' => 'Cada documento debe pesar menos de '.(QuotationDocument::MAX_KILOBYTES / 1024).' MB.',
            'documents.*.file.extensions' => 'Adjunte documentos PDF, Word, Excel, PowerPoint, imágenes JPG o PNG, o ZIP.',
        ];
    }
}
