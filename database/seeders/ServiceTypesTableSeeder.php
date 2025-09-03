<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ServiceType::create([
            'id' => 'auditoria',
            'name' => 'Auditoría',
        ]);

        ServiceType::create([
            'id' => 'consultoria',
            'name' => 'Consultoría',
        ]);

        ServiceType::create([
            'id' => 'formacion',
            'name' => 'Formación',
        ]);
    }
}
