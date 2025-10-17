<?php
// HU - 02 Buscar Servicios

namespace Tests\Feature\Sprint1\Services;

use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_search_services_by_keyword(): void
    {
        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $gestionLine = GestionLine::create([
            'name' => 'Gestión de Calidad',
        ]);

        Service::create([
            'name' => 'Auditoría Interna ISO 9001',
            'description' => 'Evaluación de sistemas de gestión de calidad',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        Service::create([
            'name' => 'Auditoría Externa',
            'description' => 'Revisión de procesos empresariales',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        Service::create([
            'name' => 'Consultoría de Procesos',
            'description' => 'Optimización de flujos de trabajo',
            'service_type_id' => 'auditoria',
            'gestion_line_id' => $gestionLine->id,
        ]);

        $response = $this->get(route('services.index', ['serviceTypeId' => 'auditoria', 'search' => 'ISO']));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('services/index')
            ->has('viewData.services', 1)
            ->where('viewData.services.0.name', 'Auditoría Interna ISO 9001')
            ->where('viewData.searchQuery', 'ISO')
        );
    }
}
