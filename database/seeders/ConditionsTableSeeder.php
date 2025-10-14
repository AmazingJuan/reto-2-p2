<?php

namespace Database\Seeders;

use App\Repositories\ConditionRepository;
use App\Repositories\ConditionValueRepository;
use App\Repositories\ServiceTypeRepository;
use App\Services\ConditionService;
use Illuminate\Database\Seeder;

class ConditionsTableSeeder extends Seeder
{
    protected ConditionService $conditionService;

    protected ServiceTypeRepository $serviceTypeRepository;

    protected ConditionRepository $conditionRepository;

    protected ConditionValueRepository $conditionValueRepository;

    /**
     * Constructor.
     */
    public function __construct(
        ConditionService $conditionService,
        ServiceTypeRepository $serviceTypeRepository,
        ConditionRepository $conditionRepository,
        ConditionValueRepository $conditionValueRepository
    ) {
        $this->conditionService = $conditionService;
        $this->serviceTypeRepository = $serviceTypeRepository;
        $this->conditionRepository = $conditionRepository;
        $this->conditionValueRepository = $conditionValueRepository;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $auditoriaServiceType = $this->serviceTypeRepository->find('auditoria');
        $consultoriaServiceType = $this->serviceTypeRepository->find('consultoria');
        $formacionServiceType = $this->serviceTypeRepository->find('formacion');

        // CONDICIONES PARA AUDITORÍA

        // Selección de profesionales

        $seleccionProfesionalAuditoriaCondition = $this->conditionService->create([
            'name' => 'Selección de profesionales',
            'allows_multiple_values' => true,
        ], [
            'Auditores certificados',
            'Experiencia mínima: 5 años',
            'Especialidad según norma ISO',
        ]);

        // Entregables
        $entregablesAuditoriaCondition = $this->conditionService->create([
            'name' => 'Entregables',
            'allows_multiple_values' => true,
            'next_condition_id' => $seleccionProfesionalAuditoriaCondition->getId(),
        ], [
            'Informe de hallazgos',
            'Plan de acción',
            'Informe ejecutivo para gerencia',
        ]);

        // Número de funcionarios entrevistados
        $numeroFuncionariosEntrevistadosAuditoriaCondition = $this->conditionService->create([
            'name' => 'Número de funcionarios entrevistados',
            'type' => 'number',
            'next_condition_id' => $entregablesAuditoriaCondition->getId(),
        ]);

        // Procesos y áreas a auditar
        $procesosAreasAuditoriaCondition = $this->conditionService->create([
            'name' => 'Procesos y áreas a auditar',
            'allows_multiple_values' => true,
            'next_condition_id' => $numeroFuncionariosEntrevistadosAuditoriaCondition->getId(),
        ], [
            'Gestión de calidad',
            'Gestión ambiental',
            'Seguridad y salud en el trabajo',
            'Gestión de activos',
            'Gestión de riesgos',
            'Sistemas de información',
            'Recursos humanos',
            'Compras y proveedores',
            'Producción/Operaciones',
            'Comercial/Ventas',
        ]);

        // Viáticos y logística
        $viaticosAuditoriaCondition = $this->conditionService->create([
            'name' => 'Viáticos y logística',
            'description' => 'Las opciones seleccionadas serán cubiertas por Training Corporation. Las no seleccionadas se asume que serán cubiertas por el cliente.',
            'allows_multiple_values' => true,
            'next_condition_id' => $procesosAreasAuditoriaCondition->getId(),
        ], [
            'Transporte',
            'Hospedaje',
            'Alimentación',
        ]);

        // Duración y dedicación
        $duracionAuditoriaCondition = $this->conditionService->create([
            'name' => 'Duración y dedicación',
        ], [
            ['value' => '1 a 2 días (Pymes)', 'next_condition_id' => $viaticosAuditoriaCondition->getId()],
            ['value' => '3 a 5 días (empresas medianas)', 'next_condition_id' => $viaticosAuditoriaCondition->getId()],
            ['value' => '>5 días (empresas grandes/multisede)', 'next_condition_id' => $viaticosAuditoriaCondition->getId()],
        ]);

        // Modalidad de prestación
        $modalidadAuditoriaCondition = $this->conditionService->create([
            'name' => 'Modalidad de prestación',
        ], [
            ['value' => 'Presencial', 'next_condition_id' => $duracionAuditoriaCondition->getId()],
            ['value' => 'Virtual (documental)', 'next_condition_id' => $procesosAreasAuditoriaCondition->getId()], // Salta viáticos
            ['value' => 'Híbrida (Mixta)', 'next_condition_id' => $duracionAuditoriaCondition->getId()],
        ]);

        // Norma o estándar aplicable
        $normaAuditoriaCondition = $this->conditionService->create([
            'name' => 'Norma o estándar aplicable',
            'next_condition_id' => $modalidadAuditoriaCondition->getId(),
            'allows_multiple_values' => true,
        ], ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 37001', 'ISO 31000', 'ISO 55001']);

        // 1. Tipo de servicio
        $tipoServicioAuditoriaCondition = $this->conditionService->create([
            'name' => 'Tipo de servicio',
        ], [
            ['value' => 'Auditoría interna (ISO 9001, 14001, 45001, 37001, 55001)', 'next_condition_id' => $normaAuditoriaCondition->getId()],
            ['value' => 'Auditoría de segunda parte (proveedores)', 'next_condition_id' => $modalidadAuditoriaCondition->getId()],
            ['value' => 'Pre-auditoría (ensayo de certificación)', 'next_condition_id' => $modalidadAuditoriaCondition->getId()],
        ]);

        // Línea de gestión (condición independiente)
        $lineaGestionAuditoriaCondition = $this->conditionService->create([
            'name' => 'Línea de gestión',
            'is_fixed' => true,
        ], [
            'Gestión de activos',
            'Sostenibilidad ambiental',
            'Eficiencia energética',
            'Gestión calidad',
            'Gestión de SST',
            'Servicios regulatorios',
            'HSEQ',
            'Seguridad de la información y ciberseguridad',
            'Laboratorio',
        ]);

        // Configurar condición inicial para Auditoría (inicia con tipo de servicio)
        $this->serviceTypeRepository->update(
            ['initial_condition_id' => $tipoServicioAuditoriaCondition->getId()],
            $auditoriaServiceType
        );

        // Viáticos y logística (último paso)
        $viaticosConsultoriaCondition = $this->conditionService->create([
            'name' => 'Viáticos y logística',
            'description' => 'Las opciones seleccionadas serán cubiertas por Training Corporation. Las no seleccionadas se asume que serán cubiertas por el cliente.',
            'allows_multiple_values' => true,
        ], [
            'Transporte',
            'Hospedaje',
            'Alimentación',
        ]);

        // Modalidad de prestación
        $modalidadConsultoriaCondition = $this->conditionService->create([
            'name' => 'Modalidad de prestación',
        ], [
            ['value' => 'Presencial', 'next_condition_id' => $viaticosConsultoriaCondition->getId()],
            ['value' => 'Virtual', 'next_condition_id' => null], // Fin del árbol, sin viáticos
            ['value' => 'Híbrida (Mixta)', 'next_condition_id' => $viaticosConsultoriaCondition->getId()],
        ]);

        // Línea de gestión (condición independiente)
        $lineaGestionConsultoriaCondition = $this->conditionService->create([
            'name' => 'Línea de gestión',
            'is_fixed' => true,
        ], [
            'Gestión de activos',
            'Sostenibilidad ambiental',
            'Eficiencia energética',
            'Gestión calidad',
            'Gestión de SST',
            'Servicios regulatorios',
            'HSEQ',
            'Seguridad de la información y ciberseguridad',
            'Laboratorio',
        ]);

        // Configurar condición inicial para Consultoría
        $this->serviceTypeRepository->update(
            ['initial_condition_id' => $modalidadConsultoriaCondition->getId()],
            $consultoriaServiceType
        );

        // Viáticos y logística (último paso)
        $viaticosFormacionCondition = $this->conditionService->create([
            'name' => 'Viáticos y logística',
            'description' => 'Las opciones seleccionadas serán cubiertas por Training Corporation. Las no seleccionadas se asume que serán cubiertas por el cliente.',
            'allows_multiple_values' => true,
        ], [
            'Transporte',
            'Hospedaje',
            'Alimentación',
        ]);

        // Modalidad de prestación
        $modalidadFormacionCondition = $this->conditionService->create([
            'name' => 'Modalidad de prestación',
        ], [
            ['value' => 'Presencial', 'next_condition_id' => $viaticosFormacionCondition->getId()],
            ['value' => 'Virtual', 'next_condition_id' => null], // Fin del árbol, sin viáticos
            ['value' => 'Híbrida (Mixta)', 'next_condition_id' => $viaticosFormacionCondition->getId()],
        ]);

        // Línea de gestión (condición independiente)
        $lineaGestionFormacionCondition = $this->conditionService->create([
            'name' => 'Línea de gestión',
            'is_fixed' => true,
        ], [
            'Gestión de activos',
            'Sostenibilidad ambiental',
            'Eficiencia energética',
            'Gestión calidad',
            'Gestión de SST',
            'Servicios regulatorios',
            'HSEQ',
            'Seguridad de la información y ciberseguridad',
            'Laboratorio',
        ]);

        // Configurar condición inicial para Formación (modalidad)
        $this->serviceTypeRepository->update(
            ['initial_condition_id' => $modalidadFormacionCondition->getId()],
            $formacionServiceType
        );
    }
}
