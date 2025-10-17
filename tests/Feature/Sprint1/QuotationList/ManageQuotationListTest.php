<?php

namespace Tests\Feature\Sprint1\QuotationList;

use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManageQuotationListTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_delete_service_from_quotation_list(): void
    {
        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $service1 = Service::create([
            'name' => 'Auditoría Interna ISO 9001',
            'description' => 'Servicio de auditoría',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $service2 = Service::create([
            'name' => 'Consultoría de Procesos',
            'description' => 'Servicio de consultoría',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $quotationList = [
            [
                'id' => 'item1',
                'services' => [
                    ['id' => (string) $service1->id, 'name' => $service1->name]
                ],
                'options' => [],
                'service_type_id' => 'auditoria',
                'service_type' => 'Auditoría',
                'gestion_line' => 'Gestión de Calidad',
                'gestion_line_id' => $gestionLine->id,
            ],
            [
                'id' => 'item2',
                'services' => [
                    ['id' => (string) $service2->id, 'name' => $service2->name]
                ],
                'options' => [],
                'service_type_id' => 'auditoria',
                'service_type' => 'Auditoría',
                'gestion_line' => 'Gestión de Calidad',
                'gestion_line_id' => $gestionLine->id,
            ]
        ];

        session(['quotation_list' => $quotationList]);

        $this->assertCount(2, session('quotation_list'));

        $response = $this->deleteJson(route('list.destroy', 'item1'), [], [
            'X-Requested-With' => 'XMLHttpRequest'
        ]);

        $response->assertStatus(200);

        $updatedList = session('quotation_list');
        $this->assertCount(1, $updatedList);
        $this->assertEquals('item2', $updatedList[0]['id']);
    }
}
