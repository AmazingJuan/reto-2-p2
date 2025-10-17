<?php
// HU - 14 Visualizar cotizaciones (admin)

namespace Tests\Feature\Sprint2\Admin;

use App\Models\User;
use App\Models\ServiceType;
use App\Models\GestionLine;
use App\Models\QuotationOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewQuotationsAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_all_quotations(): void
    {
        $admin = User::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $quotation1 = QuotationOrder::create([
            'id' => 'order-001',
            'user_id' => $user1->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '1', 'name' => 'Servicio 1']],
            'options' => [],
            'is_generated' => false,
        ]);

        $quotation2 = QuotationOrder::create([
            'id' => 'order-002',
            'user_id' => $user2->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '2', 'name' => 'Servicio 2']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/quote.pdf',
        ]);

        $quotation3 = QuotationOrder::create([
            'id' => 'order-003',
            'user_id' => $user1->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '3', 'name' => 'Servicio 3']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/quote2.pdf',
        ]);

        $this->actingAs($admin);

        $response = $this->get(route('admin.quotation-orders.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotation-orders/index')
            ->has('viewData.quotationOrders', 3)
        );
    }

    public function test_admin_can_see_quotations_from_different_users(): void
    {
        $admin = User::factory()->create();
        $user1 = User::factory()->create(['name' => 'Usuario Uno']);
        $user2 = User::factory()->create(['name' => 'Usuario Dos']);

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
            'is_generated' => true,
            'quotation_url' => 'https://example.com/user2.pdf',
        ]);

        $this->actingAs($admin);

        $response = $this->get(route('admin.quotation-orders.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotation-orders/index')
            ->has('viewData.quotationOrders', 2)
            ->where('viewData.quotationOrders.0.user_id', $user1->id)
            ->where('viewData.quotationOrders.1.user_id', $user2->id)
        );
    }

    public function test_admin_can_see_quotation_status(): void
    {
        $admin = User::factory()->create();
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

        $generatedQuotation = QuotationOrder::create([
            'id' => 'generated-order',
            'user_id' => $user->id,
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
            'services' => [['id' => '2', 'name' => 'Servicio 2']],
            'options' => [],
            'is_generated' => true,
            'quotation_url' => 'https://example.com/generated.pdf',
        ]);

        $this->actingAs($admin);

        $response = $this->get(route('admin.quotation-orders.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotation-orders/index')
            ->has('viewData.quotationOrders', 2)
            ->where('viewData.quotationOrders.0.is_generated', false)
            ->where('viewData.quotationOrders.1.is_generated', true)
        );
    }
}
