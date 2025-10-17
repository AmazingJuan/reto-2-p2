<?php
// HU - 04 Añadir servicios a la lista de cotización

namespace Tests\Feature\Sprint1\QuotationList;

use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddServiceQuotationListTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_add_service_to_quotation_list(): void
    {
        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $service = Service::create([
            'name' => 'Auditoría Interna ISO 9001',
            'description' => 'Servicio de auditoría para sistemas de gestión de calidad',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $response = $this->postJson(route('list.add'), [
            'services' => [
                ['id' => (string) $service->id, 'name' => $service->name]
            ],
            'options' => [],
            'service_type_id' => 'auditoria',
            'service_type' => 'Auditoría',
            'gestion_line' => 'Gestión de Calidad',
            'gestion_line_id' => $gestionLine->id,
        ], [
            'X-Requested-With' => 'XMLHttpRequest'
        ]);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'quotation_list' => [
                '*' => [
                    'id',
                    'services',
                    'options',
                    'service_type_id',
                    'service_type',
                    'gestion_line',
                    'gestion_line_id',
                ]
            ]
        ]);

        $response->assertJson([
            'quotation_list' => [
                [
                    'services' => [
                        ['id' => (string) $service->id, 'name' => $service->name]
                    ],
                    'service_type_id' => 'auditoria',
                    'service_type' => 'Auditoría',
                    'gestion_line' => 'Gestión de Calidad',
                ]
            ]
        ]);

        $this->assertNotEmpty(session('quotation_list'));
        $this->assertCount(1, session('quotation_list'));
    }
}