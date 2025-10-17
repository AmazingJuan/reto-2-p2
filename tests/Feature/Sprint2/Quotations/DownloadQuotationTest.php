<?php
// HU - 13 Descargar cotización

namespace Tests\Feature\Sprint2\Quotations;

use App\Models\User;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DownloadQuotationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_see_download_button_for_generated_quotations(): void
    {
        $user = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $generatedQuotation = QuotationOrder::create([
            'id' => 'generated-order',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '1', 'name' => 'Servicio 1']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://storage.example.com/quotations/generated-order.pdf',
        ]);

        $this->actingAs($user);

        $response = $this->get(route('user.orders'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('users/quotation-orders/index')
            ->has('viewData.quotationOrders', 1)
            ->where('viewData.quotationOrders.0.id', 'generated-order')
            ->where('viewData.quotationOrders.0.is_generated', true)
            ->where('viewData.quotationOrders.0.quotation_url', 'https://storage.example.com/quotations/generated-order.pdf')
        );
    }

    public function test_user_cannot_see_download_button_for_pending_quotations(): void
    {
        $user = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $pendingQuotation = QuotationOrder::create([
            'id' => 'pending-order',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '1', 'name' => 'Servicio 1']],
            'options' => [],
            'is_generated' => false,
            'quotation_url' => null,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('user.orders'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('users/quotation-orders/index')
            ->has('viewData.quotationOrders', 1)
            ->where('viewData.quotationOrders.0.id', 'pending-order')
            ->where('viewData.quotationOrders.0.is_generated', false)
            ->where('viewData.quotationOrders.0.quotation_url', null)
        );
    }

    public function test_user_can_only_download_their_own_quotations(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        QuotationOrder::create([
            'id' => 'user1-order',
            'user_id' => $user1->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '1', 'name' => 'Servicio User 1']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/user1-order.pdf',
        ]);

        $user2Order = QuotationOrder::create([
            'id' => 'user2-order',
            'user_id' => $user2->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '2', 'name' => 'Servicio User 2']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/user2-order.pdf',
        ]);

        $this->actingAs($user1);

        $response = $this->get(route('user.orders'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('users/quotation-orders/index')
            ->has('viewData.quotationOrders', 1)
            ->where('viewData.quotationOrders.0.id', 'user1-order')
            ->where('viewData.quotationOrders.0.quotation_url', 'https://example.com/user1-order.pdf')
        );
    }
}
