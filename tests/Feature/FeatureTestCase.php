<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

abstract class FeatureTestCase extends TestCase {
    use RefreshDatabase;

    protected User $admin;
    protected User $client;

    protected function setUp(): void {
        parent::setUp();

        // Ejecuta antes de cada test

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
        ]);

        $this->client = User::factory()->create([
            'role' => 'client',
            'email' => 'client@example.com',
        ]);
    }

    protected function actingAsAdmin(){
        return $this->actingAs($this->admin);
    }

    protected function actingAsClient(){
        return $this->actingAs($this->client);
    }
}