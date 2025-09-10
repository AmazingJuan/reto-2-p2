<?php

namespace App\Data;

use Illuminate\Http\Request;

class QuotationParams
{
    public function __construct(
        public readonly ?int $serviceId,
        public readonly ?string $type,
    ) {}

    // Método de fábrica para crear el objeto desde el request
    public static function fromRequest(Request $request): QuotationParams
    {
        return new self(
            serviceId: $request->query('id_servicio'),
            type: $request->query('tipo'),
        );
    }

    public function getServiceId(): ?int
    {
        return $this->serviceId;
    }

    public function getType(): ?string
    {
        return $this->type;
    }
}
