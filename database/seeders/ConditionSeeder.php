<?php

namespace Database\Seeders;

use App\Models\Condition;
use Illuminate\Database\Seeder;

class ConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Condition::create([
            'name' => 'Viaticos',
        ]);

        Condition::create([
            'name' => 'Modalidad',
        ]);

        Condition::create([
            'name' => 'Sede',
        ]);

        Condition::create([
            'name' => 'Tipo de Auditoría',
        ]);

        Condition::create([
            'name' => 'La actividad laboral entra en ARL 5?',
            'is_boolean' => true,
        ]);

        Condition::create([
            'name' => 'Tiempo necesario',
        ]);
    }
}
