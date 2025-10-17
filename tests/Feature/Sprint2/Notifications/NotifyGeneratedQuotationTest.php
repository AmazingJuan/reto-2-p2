<?php
// HU - 09 Notificar cotización generada

namespace Tests\Feature\Sprint2\Notifications;

use App\Models\User;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use App\Mail\QuotationGenerated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NotifyGeneratedQuotationTest extends TestCase
{
    use RefreshDatabase;

    public function test_sends_email_notification_when_quotation_is_generated(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'cliente@example.com',
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
            'id' => 'quotation-456',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [
                ['id' => (string) $service->id, 'name' => $service->name]
            ],
            'options' => ['Modalidad' => 'Presencial', 'Duración' => '3 días'],
            'is_generated' => false,
            'quotation_url' => null,
        ]);

        $generatedUrl = 'https://storage.trainingcorporation.com/quotations/quotation-456.pdf';

        $response = $this->patchJson(route('quotation_order.confirm', $quotationOrder->id), [
            'url' => $generatedUrl,
        ]);

        $response->assertStatus(204);

        Mail::assertSent(QuotationGenerated::class, function ($mail) use ($user, $quotationOrder) {
            return $mail->hasTo($user->email) &&
                   $mail->order->id === $quotationOrder->id;
        });

        Mail::assertSent(QuotationGenerated::class, 1);
    }

    public function test_email_contains_quotation_information(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Tecnología',
        ]);

        $consultoria = ServiceType::create([
            'id' => 'consultoria',
            'name' => 'Consultoría',
        ]);

        $quotationOrder = QuotationOrder::create([
            'id' => 'test-789',
            'user_id' => $user->id,
            'service_type_id' => 'consultoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [
                ['id' => '1', 'name' => 'Consultoría Estratégica']
            ],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/quotation.pdf',
        ]);

        $mailable = new QuotationGenerated($quotationOrder);
        $mailable->build();

        $this->assertEquals('Tu cotización #test-789 está lista', $mailable->subject);
        $this->assertEquals($quotationOrder->id, $mailable->order->id);

        $mailable->assertSeeInHtml('test-789');
        $mailable->assertSeeInHtml($quotationOrder->getQuotationUrl());
        $mailable->assertSeeInHtml('Descargar Cotización');
    }
}