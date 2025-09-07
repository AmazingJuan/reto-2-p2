<?php

namespace Database\Seeders;

use App\Models\Condition;
use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ConditionServiceTypeTableSeeder extends Seeder
{
    public function run(): void
    {
        $viaticos = Condition::where('name', 'Viaticos')->first();
        $modalidad = Condition::where('name', 'Modalidad')->first();
        $tiempo = Condition::where('name', 'Tiempo necesario')->first();

        if (! $viaticos || ! $modalidad || ! $tiempo) {
            throw new \Exception('Faltan condiciones: Viaticos, Modalidad o Tiempo necesario');
        }

        // IDs o slugs de los tipos de servicio
        $serviceTypeIds = ['auditoria', 'consultoria', 'formacion'];

        // Obtener modelos de ServiceType por su 'id' o 'slug'
        $serviceTypes = ServiceType::whereIn('id', $serviceTypeIds)->get();

        if ($serviceTypes->count() !== count($serviceTypeIds)) {
            throw new \Exception('Faltan algunos ServiceTypes en la base de datos.');
        }

        // Asociar usando la relación Eloquent
        $viaticos->serviceTypes()->syncWithoutDetaching($serviceTypes->pluck('id'));
        $modalidad->serviceTypes()->syncWithoutDetaching($serviceTypes->pluck('id'));
        $tiempo->serviceTypes()->syncWithoutDetaching($serviceTypes->pluck('id'));
    }
}
