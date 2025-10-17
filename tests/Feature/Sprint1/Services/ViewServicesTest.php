<?php
// HU - 01 Visualizar Servicios

namespace Tests\Feature\Sprint1\Services;

use App\Models\ServiceType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_services_grouped_by_categories(): void
    {
        $auditoria = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        $consultoria = ServiceType::create([
            'id' => 'consultoria',
            'name' => 'Consultoría',
        ]);

        $formacion = ServiceType::create([
            'id' => 'formacion',
            'name' => 'Formación',
        ]);

        $response = $this->get(route('portfolio.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('portfolio/index')
            ->has('services', 3)
            ->where('services.0.id', 'auditoria')
            ->where('services.0.name', 'Auditoría')
            ->where('services.1.id', 'consultoria')
            ->where('services.1.name', 'Consultoría')
            ->where('services.2.id', 'formacion')
            ->where('services.2.name', 'Formación')
        );
    }
}