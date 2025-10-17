<?php
// HU - 08 Recibir cotizaciones generadas

namespace Tests\Feature\Sprint2\Api;

use App\Models\User;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\QuotationGenerated;
use Tests\TestCase;

class ReceiveGeneratedQuotationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_receive_generated_quotation_from_external_api(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

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

        $quotationOrder = QuotationOrder::create([
            'id' => 'test-quotation-123',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [
                ['id' => (string) $service->id, 'name' => $service->name]
            ],
            'options' => ['Modalidad' => 'Virtual'],
            'is_generated' => false,
            'quotation_url' => null,
        ]);

        $generatedUrl = 'https://external-system.com/quotations/test-quotation-123.pdf';

        $response = $this->patchJson(route('quotation_order.confirm', $quotationOrder->id), [
            'url' => $generatedUrl,
        ]);

        $response->assertStatus(204);

        $this->assertDatabaseHas('quotation_orders', [
            'id' => 'test-quotation-123',
            'quotation_url' => $generatedUrl,
            'is_generated' => true,
        ]);

        $quotationOrder->refresh();
        $this->assertEquals($generatedUrl, $quotationOrder->quotation_url);
        $this->assertTrue($quotationOrder->is_generated);

        Mail::assertSent(QuotationGenerated::class, function ($mail) use ($user, $quotationOrder) {
            return $mail->hasTo($user->email) && 
                   $mail->order->id === $quotationOrder->id;
        });
    }

    public function test_returns_404_when_quotation_order_not_found(): void
    {
        $response = $this->patchJson(route('quotation_order.confirm', 'non-existent-id'), [
            'url' => 'https://external-system.com/quotations/test.pdf',
        ]);

        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Quotation Order not found',
        ]);
    }
}
