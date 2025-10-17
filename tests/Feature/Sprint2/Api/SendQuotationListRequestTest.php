<?php
// HU - 07 Enviar solicitud de cotización

namespace Tests\Feature\Sprint2\Api;

use App\Models\User;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SendQuotationListRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_send_quotation_request_to_api(): void
    {
        $user = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $service = Service::create([
            'name' => 'Auditoría Interna ISO 9001',
            'description' => 'Servicio de auditoría',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $this->actingAs($user);

        $response = $this->postJson(route('quotation_order.create'), [
            'services' => [
                ['id' => (string) $service->id, 'name' => $service->name]
            ],
            'options' => ['Modalidad' => 'Virtual'],
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'id',
            'user_id',
            'service_type_id',
            'gestion_line_id',
            'services',
            'options',
        ]);

        $response->assertJson([
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $this->assertDatabaseHas('quotation_orders', [
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'is_generated' => false,
        ]);

        $quotationOrder = QuotationOrder::where('user_id', $user->id)->first();
        $this->assertNotNull($quotationOrder);
        $this->assertEquals('auditoria', $quotationOrder->service_type_id);
        $this->assertIsArray($quotationOrder->services);
        $this->assertCount(1, $quotationOrder->services);
        $this->assertEquals($service->name, $quotationOrder->services[0]['name']);
        $this->assertIsArray($quotationOrder->options);
        $this->assertEquals('Virtual', $quotationOrder->options['Modalidad']);
    }
}
