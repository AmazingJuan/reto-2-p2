<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(GestionLineTableSeeder::class);
        $this->call(ServiceTypesTableSeeder::class);
        $this->call(ConditionsTableSeeder::class);
        $this->call(ServicesTableSeeder::class);
    }
}
