<?php

namespace Database\Seeders;

use App\Models\Condition;
use App\Models\ConditionValue;
use Illuminate\Database\Seeder;

class ConditionValuesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $viaticos_condition_id = Condition::where('name', 'Viaticos')->first()->id;
        $modalidad_condition_id = Condition::where('name', 'Modalidad')->first()->id;
        $sede_condition_id = Condition::where('name', 'Sedes')->first()->id;
        $tipoAuditoria_condition_id = Condition::where('name', 'Tipo de Auditoría')->first()->id;
        $tiempoNecesario_condition_id = Condition::where('name', 'Tiempo necesario')->first()->id;

        ConditionValue::create([
            'condition_id' => $viaticos_condition_id,
            'value' => 'Tiquetes',
        ]);

        ConditionValue::create([
            'condition_id' => $viaticos_condition_id,
            'value' => 'Alimentación',
        ]);

        ConditionValue::create([
            'condition_id' => $viaticos_condition_id,
            'value' => 'Alojamiento',
        ]);

        ConditionValue::create([
            'condition_id' => $viaticos_condition_id,
            'value' => 'Transporte local',
        ]);

        ConditionValue::create([
            'condition_id' => $modalidad_condition_id,
            'value' => 'Presencial',
        ]);

        ConditionValue::create([
            'condition_id' => $modalidad_condition_id,
            'value' => 'Virtual',
        ]);

        ConditionValue::create([
            'condition_id' => $modalidad_condition_id,
            'value' => 'Mixto',
        ]);

    }
}
