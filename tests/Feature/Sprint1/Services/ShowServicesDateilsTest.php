<?php
// HU - 03 Mostrar Detalles del Servicio

namespace Tests\Feature\Sprint1\Services;

use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowServicesDateilsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_service_details(): void
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
            'description' => 'Servicio de auditoría para sistemas de gestión de calidad según norma ISO 9001',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $response = $this->get(route('services.index', ['serviceTypeId' => 'auditoria']));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('services/index')
            ->where('viewData.serviceType', 'Auditoría')
            ->where('viewData.serviceTypeId', 'auditoria')
            ->has('viewData.services', 1)
            ->where('viewData.services.0.name', 'Auditoría Interna ISO 9001')
            ->where('viewData.services.0.description', 'Servicio de auditoría para sistemas de gestión de calidad según norma ISO 9001')
            ->where('viewData.services.0.gestion_line_name', 'Gestión de Calidad')
        );
    }
}
