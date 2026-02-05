<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Usuario de Prueba',
            'email' => 'test@example.com',
            'password' => Hash::make('1234'),
            'phone'=> '1234567890',
        ]);

        User::create([
            'name' => 'Diego',
            'email' => 'diego@example.com',
            'password' => Hash::make('diegogonzalez'),
            'phone' => '0987654321',
        ]);

        // Datos de ejemplo porque me dió mucha pereza crearlos manualmente
    
        $this->call(ExampleDataSeeder::class);
    }
}
