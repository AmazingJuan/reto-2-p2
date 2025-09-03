<?php

namespace Database\Seeders;

use App\Models\Condition;
use Illuminate\Database\Seeder;

class ConditionServiceTypeTableSeeder extends Seeder
{
    public function run(): void
    {
        $viaticos = Condition::where('name', 'Viaticos')->first();
        $modalidad = Condition::where('name', 'Modalidad')->first();

        if (!$viaticos || !$modalidad) {
            throw new \Exception("Faltan condiciones: Viaticos o Modalidad");
        }

        // IDs de service_types que ya existen como string
        $serviceTypeIds = ['auditoria', 'consultoria', 'formacion'];

        // Insertar manualmente en la tabla pivote
        foreach ($serviceTypeIds as $typeId) {
            \DB::table('condition_service_type')->insert([
                'condition_id' => $viaticos->id,
                'service_type_id' => $typeId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            \DB::table('condition_service_type')->insert([
                'condition_id' => $modalidad->id,
                'service_type_id' => $typeId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
