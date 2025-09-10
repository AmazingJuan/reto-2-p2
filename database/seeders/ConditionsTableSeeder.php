<?php

namespace Database\Seeders;

use App\Models\Condition;
use Illuminate\Database\Seeder;

class ConditionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
/*
        Condition::create([
            'name' => 'Viaticos',
            'allows_other_values' => true,
            'allows_multiple_values' => true,

        ]);

        Condition::create([
            'name' => 'Modalidad',

        ]);

        Condition::create([
            'name' => 'Sedes',
            'is_fixed' => false,
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
            'type' => 'time',
        ]);
*/
        Condition::create([
            'name' => 'Línea de Gestión',
            'allows_multiple_values' => false,
        ]);

        Condition::create([
            'name' => 'Tipo de servicio',
            'allows_multiple_values' => true,
        ]);

        Condition::create([
        'name' => 'Norma',
        'allows_multiple_values' => true,
        ]);

        Condition::create([
        'name' => 'Modalidad',
        'allows_multiple_values' => false,
        ]);        

        Condition::create([
        'name' => 'Duracion',
        'allows_multiple_values' => false,
        ]);

        Condition::create([
        'name' => 'Viaticos',
        'allows_multiple_values' => true,
        'allows_other_values' => true,
        ]);

        Condition::create([
        'name' => 'Participantes',
        'allows_multiple_values' => true,
        'allows_other_values' => true,
        ]);

        Condition::create([
        'name' => 'Entregables',
        'allows_multiple_values' => true,
        ]);

        Condition::create([
        'name' => 'Seleccion de profesional',
        'allows_multiple_values' => true,
        'allows_other_values' => true,
        ]);
    }
}