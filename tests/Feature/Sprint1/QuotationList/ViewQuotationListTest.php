<?php
// HU - 05 Visualizar lista de cotizacion

namespace Tests\Feature\Sprint1\QuotationList;

use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewQuotationListTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_quotation_list_with_items(): void
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

        $quotationList = [
            [
                'id' => 'test123',
                'services' => [
                    ['id' => (string) $service->id, 'name' => $service->name]
                ],
                'options' => ['Modalidad' => 'Virtual'],
                'service_type_id' => 'auditoria',
                'service_type' => 'Auditoría',
                'gestion_line' => 'Gestión de Calidad',
                'gestion_line_id' => $gestionLine->id,
            ]
        ];

        session(['quotation_list' => $quotationList]);

        $response = $this->getJson(route('list.index'), [
            'X-Requested-With' => 'XMLHttpRequest'
        ]);

        $response->assertStatus(200);

        $response->assertJson([
            [
                'id' => 'test123',
                'services' => [
                    ['id' => (string) $service->id, 'name' => $service->name]
                ],
                'options' => ['Modalidad' => 'Virtual'],
                'service_type_id' => 'auditoria',
                'service_type' => 'Auditoría',
                'gestion_line' => 'Gestión de Calidad',
            ]
        ]);

        $response->assertJsonCount(1);
    }

    public function test_can_view_empty_quotation_list(): void
    {
        $response = $this->getJson(route('list.index'), [
            'X-Requested-With' => 'XMLHttpRequest'
        ]);

        $response->assertStatus(200);

        $response->assertJson([]);

        $response->assertJsonCount(0);
    }
}
