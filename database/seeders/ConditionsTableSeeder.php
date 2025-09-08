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

        Condition::create([
            'name' => 'Viaticos',
            'allows_other_values' => true,
            'allows_multiple_values' => true,

        ]);

        // pongo esa linea en donde yo quiera que tin siii, pero hay algunas condiciones que no están
        // pero entonces pon lo de otro de una vez en modalidad no ?
        // no entiendo nada entonces dejo eso así? noo, este se quita
        // ya es funcional? pues quitalo no? q estamos esperando jsjsj no entiendo nada miremos si si funciona
        /*
hay dos archivos iguales, q tan charro jajaj como pues solo el otro
        */
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
    }
}
