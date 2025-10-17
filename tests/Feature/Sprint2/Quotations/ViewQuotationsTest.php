<?php
// HU - 12 Visualizar cotizaciones

namespace Tests\Feature\Sprint2\Quotations;

use App\Models\User;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewQuotationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_quotations(): void
    {
        $user = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $quotation1 = QuotationOrder::create([
            'id' => 'order-001',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '1', 'name' => 'Servicio 1']],
            'options' => [],
            'is_generated' => false,
        ]);

        $quotation2 = QuotationOrder::create([
            'id' => 'order-002',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '2', 'name' => 'Servicio 2']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/quote.pdf',
        ]);

        $this->actingAs($user);

        $response = $this->get(route('user.orders'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('users/quotation-orders/index')
            ->has('viewData.quotationOrders', 2)
            ->where('viewData.quotationOrders.0.id', 'order-001')
            ->where('viewData.quotationOrders.0.user_id', $user->id)
            ->where('viewData.quotationOrders.0.is_generated', false)
            ->where('viewData.quotationOrders.1.id', 'order-002')
            ->where('viewData.quotationOrders.1.is_generated', true)
        );
    }

    public function test_user_only_sees_their_own_quotations(): void
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
            'is_generated' => false,
        ]);

        QuotationOrder::create([
            'id' => 'user2-order',
            'user_id' => $user2->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '2', 'name' => 'Servicio User 2']],
            'options' => [],
            'is_generated' => false,
        ]);

        $this->actingAs($user1);

        $response = $this->get(route('user.orders'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('users/quotation-orders/index')
            ->has('viewData.quotationOrders', 1)
            ->where('viewData.quotationOrders.0.id', 'user1-order')
            ->where('viewData.quotationOrders.0.user_id', $user1->id)
        );
    }
}
