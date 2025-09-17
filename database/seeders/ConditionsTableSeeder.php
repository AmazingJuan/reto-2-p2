<?php

namespace Database\Seeders;

use App\Repositories\ConditionRepository;
use App\Repositories\ServiceTypeRepository;
use App\Services\ConditionService;
use Illuminate\Database\Seeder;

class ConditionsTableSeeder extends Seeder
{
    protected ConditionService $conditionService;

    protected ServiceTypeRepository $serviceTypeRepository;

    protected ConditionRepository $conditionRepository;

    /**
     * Constructor.
     */
    public function __construct(
        ConditionService $conditionService,
        ServiceTypeRepository $serviceTypeRepository,
        ConditionRepository $conditionRepository
    ) {
        $this->conditionService = $conditionService;
        $this->serviceTypeRepository = $serviceTypeRepository;
        $this->conditionRepository = $conditionRepository;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch service types
        $auditoriaServiceType = $this->serviceTypeRepository->find('auditoria');
        $consultoriaServiceType = $this->serviceTypeRepository->find('consultoria');
        $formacionServiceType = $this->serviceTypeRepository->find('formacion');

        // -------------------------------
        // Create conditions for "Auditoria"
        // -------------------------------

        $tiempoNecesarioAuditoriaCondition = $this->conditionService->create([
            'name' => 'Tiempo necesario (días)',
            'type' => 'time',
        ]);

        $tiempoNecesarioAuditoriaVirCondition = $this->conditionService->create([
            'name' => 'Tiempo necesario virtual (días)',
            'type' => 'time',
        ]);

        $tiempoNecesarioAuditoriaPresCondition = $this->conditionService->create([
            'name' => 'Tiempo necesario presencial (días)',
            'type' => 'time',
            'next_condition_id' => $tiempoNecesarioAuditoriaVirCondition->getId(),
        ]);

        $modalidadAuditoriaCondition = $this->conditionService->create(
            ['name' => 'Modalidad'],
            [
                ['value' => 'Presencial', 'next_condition_id' => $tiempoNecesarioAuditoriaCondition->getId()],
                ['value' => 'Virtual', 'next_condition_id' => $tiempoNecesarioAuditoriaCondition->getId()],
                ['value' => 'Mixto', 'next_condition_id' => $tiempoNecesarioAuditoriaPresCondition->getId()],
            ]
        );

        $tipoServicioAuditoriaCondition = $this->conditionService->create(
            ['name' => 'Tipo de servicio'],
            [
                'Auditoría interna (ISO 9001, 14001, 45001, 37001, 55001)',
                'Auditoría de segunda parte (proveedores)',
                'Pre-auditoría (ensayo de certificación)',
            ]
        );

        $viaticosAuditoriaCondition = $this->conditionService->create(
            ['name' => 'Viáticos'],
            ['Tiquetes', 'Hospedaje', 'Alimentación', 'Transporte local']
        );

        // Link initial and next conditions for "Auditoria"
        $this->serviceTypeRepository->update(
            ['initial_condition_id' => $viaticosAuditoriaCondition->getId()],
            $auditoriaServiceType
        );

        $this->conditionRepository->update(
            ['next_condition_id' => $tipoServicioAuditoriaCondition->getId()],
            $viaticosAuditoriaCondition
        );

        $this->conditionRepository->update(
            ['next_condition_id' => $modalidadAuditoriaCondition->getId()],
            $tipoServicioAuditoriaCondition
        );

        $numeroParticipantesCondition = $this->conditionService->create([
            'name' => 'Número de participantes',
            'type' => 'number',
        ]);

        // -------------------------------
        // Create conditions for "Consultoria"
        // -------------------------------

        $tiempoNecesarioConsultoriaCondition = $this->conditionService->create([
            'name' => 'Tiempo necesario (días)',
            'type' => 'time',
        ]);

        // -------------------------------
        // Create conditions for "Formacion"
        // -------------------------------

        $tiempoNecesarioFormacionCondition = $this->conditionService->create([
            'name' => 'Tiempo necesario (horas)',
            'type' => 'time',
        ]);

        $normaCondition = $this->conditionService->create(
            [
                'name' => 'Norma',
                'allows_multiple_values' => true,
            ],
            ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 37001', 'ISO 55001']
        );

        $requiereNormaCondition = $this->conditionService->create([
            'name' => '¿Requiere norma?',
            'is_boolean' => true,
        ]);
    }
}
