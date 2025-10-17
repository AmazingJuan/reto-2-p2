<?php
// HU - 20 Gestión de líneas de gestión y servicios

namespace Tests\Feature\Sprint2\Admin;

use App\Models\GestionLine;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManageGestionLineAndServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_service_with_valid_data(): void
    {
        $user = User::factory()->create();
        
        $serviceType = ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);
        
        $gestionLine = GestionLine::create([
            'name' => 'Línea de Gestión Test',
        ]);

        $serviceData = [
            'name' => 'Nuevo Servicio de Auditoría',
            'description' => 'Descripción detallada del servicio',
            'service_type_id' => $serviceType->id,
            'gestion_line_id' => $gestionLine->id,
        ];

        $response = $this->actingAs($user)->post(route('admin.services.store'), $serviceData);

        $response->assertStatus(302);
        $response->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'name' => 'Nuevo Servicio de Auditoría',
            'description' => 'Descripción detallada del servicio',
            'service_type_id' => $serviceType->id,
            'gestion_line_id' => $gestionLine->id,
        ]);
    }

    public function test_admin_can_create_gestion_line_with_valid_data(): void
    {
        $user = User::factory()->create();

        $lineData = [
            'name' => 'Nueva Línea de Gestión',
        ];

        $response = $this->actingAs($user)->post(route('admin.lines.store'), $lineData);

        $response->assertStatus(302);
        $response->assertRedirect(route('admin.lines.index'));

        $this->assertDatabaseHas('gestion_lines', [
            'name' => 'Nueva Línea de Gestión',
        ]);
    }

    public function test_service_creation_validates_required_fields(): void
    {
        $user = User::factory()->create();

        $invalidData = [
            'name' => '',
            'service_type_id' => null,
            'gestion_line_id' => null,
        ];

        $response = $this->actingAs($user)->post(route('admin.services.store'), $invalidData);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['name', 'service_type_id', 'gestion_line_id']);

        $this->assertEquals(0, Service::count());
    }

    public function test_gestion_line_creation_validates_required_name(): void
    {
        $user = User::factory()->create();

        $invalidData = [
            'name' => '',
        ];

        $response = $this->actingAs($user)->post(route('admin.lines.store'), $invalidData);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['name']);

        $this->assertEquals(0, GestionLine::count());
    }
}
