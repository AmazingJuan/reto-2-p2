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
        ]);
        /*
        $this->call(GestionLineTableSeeder::class);
        $this->call(ServiceTypesTableSeeder::class);
        $this->call(ConditionsTableSeeder::class);
        $this->call(ServicesTableSeeder::class);
        */
    }
}
