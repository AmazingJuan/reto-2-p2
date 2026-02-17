<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use App\Models\Condition;
use App\Models\ConditionOption;
use App\Models\GestionLine;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ExampleDataSeeder extends Seeder
{
    /**
     * Seed the application's database with example data for testing.
     */
    public function run(): void
    {
        // =============================================
        // 1. CREAR UNIDADES DE NEGOCIO
        // =============================================
        $auditoria = BusinessUnit::create([
            'name' => 'auditoria',
            'display_name' => 'Auditoría',
        ]);

        $consultoria = BusinessUnit::create([
            'name' => 'consultoria',
            'display_name' => 'Consultoría',
        ]);

        $formacion = BusinessUnit::create([
            'name' => 'formacion',
            'display_name' => 'Formación',
        ]);

        // =============================================
        // 2. CREAR LÍNEAS DE GESTIÓN
        // =============================================
        $hseq = GestionLine::create(['name' => 'HSEQ']);
        $sst = GestionLine::create(['name' => 'Seguridad y Salud en el Trabajo']);
        $activos = GestionLine::create(['name' => 'Gestión de Activos']);
        $calidad = GestionLine::create(['name' => 'Gestión de Calidad']);
        $ambiental = GestionLine::create(['name' => 'Gestión Ambiental']);
        $riesgos = GestionLine::create(['name' => 'Gestión de Riesgos']);

        // =============================================
        // 3. CREAR SERVICIOS POR UNIDAD DE NEGOCIO
        // =============================================

        // --- AUDITORÍA ---
        // HSEQ
        Service::create(['name' => 'Auditoría ISO 9001:2015', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Auditoría ISO 14001:2015', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Auditoría ISO 45001:2018', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Auditoría Integrada HSEQ', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $hseq->id]);
        
        // SST
        Service::create(['name' => 'Auditoría SG-SST', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Auditoría de Cumplimiento Legal SST', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $sst->id]);
        
        // Gestión de Activos
        Service::create(['name' => 'Auditoría ISO 55001', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $activos->id]);
        
        // Calidad
        Service::create(['name' => 'Auditoría de Segunda Parte', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $calidad->id]);
        Service::create(['name' => 'Auditoría de Procesos', 'business_unit_id' => $auditoria->id, 'gestion_line_id' => $calidad->id]);

        // --- CONSULTORÍA ---
        // HSEQ
        Service::create(['name' => 'Implementación ISO 9001:2015', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Implementación ISO 14001:2015', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Implementación ISO 45001:2018', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Sistema Integrado de Gestión HSEQ', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $hseq->id]);
        
        // SST
        Service::create(['name' => 'Diseño e Implementación SG-SST', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Matriz de Peligros y Riesgos', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Plan de Emergencias', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Investigación de Accidentes', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $sst->id]);
        
        // Gestión de Activos
        Service::create(['name' => 'Implementación ISO 55001', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $activos->id]);
        Service::create(['name' => 'Plan de Mantenimiento', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $activos->id]);
        Service::create(['name' => 'Gestión del Ciclo de Vida de Activos', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $activos->id]);
        
        // Ambiental
        Service::create(['name' => 'Estudios de Impacto Ambiental', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $ambiental->id]);
        Service::create(['name' => 'Plan de Gestión Ambiental', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $ambiental->id]);
        Service::create(['name' => 'Gestión de Residuos', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $ambiental->id]);
        
        // Riesgos
        Service::create(['name' => 'Implementación ISO 31000', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $riesgos->id]);
        Service::create(['name' => 'Análisis de Riesgos Empresariales', 'business_unit_id' => $consultoria->id, 'gestion_line_id' => $riesgos->id]);

        // --- FORMACIÓN ---
        // HSEQ
        Service::create(['name' => 'Curso Auditor Interno ISO 9001', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Curso Auditor Interno ISO 14001', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Curso Auditor Interno ISO 45001', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $hseq->id]);
        Service::create(['name' => 'Diplomado en Sistemas Integrados HSEQ', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $hseq->id]);
        
        // SST
        Service::create(['name' => 'Curso de 50 Horas SG-SST', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Curso de 20 Horas SG-SST', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Trabajo en Alturas', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Primeros Auxilios', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Brigadas de Emergencia', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        Service::create(['name' => 'Manejo Defensivo', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $sst->id]);
        
        // Gestión de Activos
        Service::create(['name' => 'Curso ISO 55001', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $activos->id]);
        Service::create(['name' => 'Gestión de Mantenimiento', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $activos->id]);
        
        // Ambiental
        Service::create(['name' => 'Curso Gestión Ambiental ISO 14001', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $ambiental->id]);
        Service::create(['name' => 'Gestión de Residuos Peligrosos', 'business_unit_id' => $formacion->id, 'gestion_line_id' => $ambiental->id]);

        // =============================================
        // 4. CREAR ÁRBOL DE CONDICIONES PARA AUDITORÍA
        // =============================================
        
        // Condición final (hoja)
        $condFechas = Condition::create([
            'label' => '¿En qué fechas desea realizar la auditoría?',
            'interaction_type' => 'range',
            'type' => 'date',
            'observation' => 'Seleccione el rango de fechas preferido para la auditoría',
            'allows_multiple_values' => false,
            'business_unit_id' => $auditoria->id,
            'next_condition_id' => null,
        ]);

        // Condición de observaciones
        $condObservaciones = Condition::create([
            'label' => '¿Tiene alguna observación adicional?',
            'interaction_type' => 'input',
            'type' => 'text',
            'observation' => 'Ingrese cualquier información adicional relevante',
            'allows_multiple_values' => false,
            'business_unit_id' => $auditoria->id,
            'next_condition_id' => $condFechas->id,
        ]);

        // Condición de número de empleados
        $condEmpleados = Condition::create([
            'label' => '¿Cuántos empleados tiene la empresa?',
            'interaction_type' => 'options',
            'type' => 'number',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $auditoria->id,
            'next_condition_id' => null, // Se define por opciones
        ]);

        // Opciones para número de empleados
        ConditionOption::create(['label' => '1 - 10 empleados', 'condition_id' => $condEmpleados->id, 'next_condition_id' => $condObservaciones->id]);
        ConditionOption::create(['label' => '11 - 50 empleados', 'condition_id' => $condEmpleados->id, 'next_condition_id' => $condObservaciones->id]);
        ConditionOption::create(['label' => '51 - 200 empleados', 'condition_id' => $condEmpleados->id, 'next_condition_id' => $condObservaciones->id]);
        ConditionOption::create(['label' => 'Más de 200 empleados', 'condition_id' => $condEmpleados->id, 'next_condition_id' => $condObservaciones->id]);

        // Condición de sedes
        $condSedes = Condition::create([
            'label' => '¿Cuántas sedes o ubicaciones tiene la empresa?',
            'interaction_type' => 'options',
            'type' => 'number',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $auditoria->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => '1 sede', 'condition_id' => $condSedes->id, 'next_condition_id' => $condEmpleados->id]);
        ConditionOption::create(['label' => '2 - 5 sedes', 'condition_id' => $condSedes->id, 'next_condition_id' => $condEmpleados->id]);
        ConditionOption::create(['label' => 'Más de 5 sedes', 'condition_id' => $condSedes->id, 'next_condition_id' => $condEmpleados->id]);

        // Condición inicial de Auditoría - ¿Tiene certificación?
        $condCertificacion = Condition::create([
            'label' => '¿La empresa cuenta con alguna certificación vigente?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $auditoria->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'Sí, tiene certificación vigente', 'condition_id' => $condCertificacion->id, 'next_condition_id' => $condSedes->id]);
        ConditionOption::create(['label' => 'No, pero está en proceso', 'condition_id' => $condCertificacion->id, 'next_condition_id' => $condSedes->id]);
        ConditionOption::create(['label' => 'No tiene certificación', 'condition_id' => $condCertificacion->id, 'next_condition_id' => $condSedes->id]);

        // Asignar condición inicial a Auditoría
        $auditoria->initial_condition_id = $condCertificacion->id;
        $auditoria->save();

        // =============================================
        // 5. CREAR ÁRBOL DE CONDICIONES PARA CONSULTORÍA
        // =============================================

        // Condición final
        $condConsultFechas = Condition::create([
            'label' => '¿Cuándo desea iniciar el proyecto de consultoría?',
            'interaction_type' => 'range',
            'type' => 'date',
            'observation' => 'Indique la fecha estimada de inicio del proyecto',
            'allows_multiple_values' => false,
            'business_unit_id' => $consultoria->id,
            'next_condition_id' => null,
        ]);

        // Presupuesto
        $condPresupuesto = Condition::create([
            'label' => '¿Cuál es su presupuesto estimado para este proyecto?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $consultoria->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'Menos de $5.000.000 COP', 'condition_id' => $condPresupuesto->id, 'next_condition_id' => $condConsultFechas->id]);
        ConditionOption::create(['label' => '$5.000.000 - $15.000.000 COP', 'condition_id' => $condPresupuesto->id, 'next_condition_id' => $condConsultFechas->id]);
        ConditionOption::create(['label' => '$15.000.000 - $30.000.000 COP', 'condition_id' => $condPresupuesto->id, 'next_condition_id' => $condConsultFechas->id]);
        ConditionOption::create(['label' => 'Más de $30.000.000 COP', 'condition_id' => $condPresupuesto->id, 'next_condition_id' => $condConsultFechas->id]);
        ConditionOption::create(['label' => 'No tengo un presupuesto definido', 'condition_id' => $condPresupuesto->id, 'next_condition_id' => $condConsultFechas->id]);

        // Sector económico
        $condSector = Condition::create([
            'label' => '¿A qué sector económico pertenece su empresa?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $consultoria->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'Industrial / Manufactura', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Construcción', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Servicios', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Comercio', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Salud', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Educación', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Tecnología', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id]);
        ConditionOption::create(['label' => 'Otro', 'condition_id' => $condSector->id, 'next_condition_id' => $condPresupuesto->id, 'is_other' => true]);

        // Condición inicial Consultoría
        $condObjetivo = Condition::create([
            'label' => '¿Cuál es su objetivo principal con este servicio?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $consultoria->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'Obtener certificación', 'condition_id' => $condObjetivo->id, 'next_condition_id' => $condSector->id]);
        ConditionOption::create(['label' => 'Mejorar procesos internos', 'condition_id' => $condObjetivo->id, 'next_condition_id' => $condSector->id]);
        ConditionOption::create(['label' => 'Cumplimiento legal/normativo', 'condition_id' => $condObjetivo->id, 'next_condition_id' => $condSector->id]);
        ConditionOption::create(['label' => 'Reducción de riesgos', 'condition_id' => $condObjetivo->id, 'next_condition_id' => $condSector->id]);
        ConditionOption::create(['label' => 'Todos los anteriores', 'condition_id' => $condObjetivo->id, 'next_condition_id' => $condSector->id]);

        $consultoria->initial_condition_id = $condObjetivo->id;
        $consultoria->save();

        // =============================================
        // 6. CREAR ÁRBOL DE CONDICIONES PARA FORMACIÓN
        // =============================================

        // Condición final
        $condFormFechas = Condition::create([
            'label' => '¿En qué fechas desea realizar la capacitación?',
            'interaction_type' => 'range',
            'type' => 'date',
            'observation' => 'Indique el rango de fechas preferido',
            'allows_multiple_values' => false,
            'business_unit_id' => $formacion->id,
            'next_condition_id' => null,
        ]);

        // Ubicación
        $condUbicacion = Condition::create([
            'label' => '¿Dónde desea realizar la capacitación?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $formacion->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'En las instalaciones de mi empresa', 'condition_id' => $condUbicacion->id, 'next_condition_id' => $condFormFechas->id]);
        ConditionOption::create(['label' => 'En las instalaciones de Training Corporation', 'condition_id' => $condUbicacion->id, 'next_condition_id' => $condFormFechas->id]);
        ConditionOption::create(['label' => 'Virtual / En línea', 'condition_id' => $condUbicacion->id, 'next_condition_id' => $condFormFechas->id]);
        ConditionOption::create(['label' => 'Híbrido (presencial + virtual)', 'condition_id' => $condUbicacion->id, 'next_condition_id' => $condFormFechas->id]);

        // Número de participantes
        $condParticipantes = Condition::create([
            'label' => '¿Cuántas personas participarán en la capacitación?',
            'interaction_type' => 'options',
            'type' => 'number',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $formacion->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => '1 - 5 personas', 'condition_id' => $condParticipantes->id, 'next_condition_id' => $condUbicacion->id]);
        ConditionOption::create(['label' => '6 - 15 personas', 'condition_id' => $condParticipantes->id, 'next_condition_id' => $condUbicacion->id]);
        ConditionOption::create(['label' => '16 - 30 personas', 'condition_id' => $condParticipantes->id, 'next_condition_id' => $condUbicacion->id]);
        ConditionOption::create(['label' => 'Más de 30 personas', 'condition_id' => $condParticipantes->id, 'next_condition_id' => $condUbicacion->id]);

        // Condición inicial Formación
        $condModalidad = Condition::create([
            'label' => '¿Qué tipo de formación requiere?',
            'interaction_type' => 'options',
            'type' => 'text',
            'observation' => null,
            'allows_multiple_values' => false,
            'business_unit_id' => $formacion->id,
            'next_condition_id' => null,
        ]);

        ConditionOption::create(['label' => 'Curso corto (8-16 horas)', 'condition_id' => $condModalidad->id, 'next_condition_id' => $condParticipantes->id]);
        ConditionOption::create(['label' => 'Curso intensivo (20-50 horas)', 'condition_id' => $condModalidad->id, 'next_condition_id' => $condParticipantes->id]);
        ConditionOption::create(['label' => 'Diplomado (100+ horas)', 'condition_id' => $condModalidad->id, 'next_condition_id' => $condParticipantes->id]);
        ConditionOption::create(['label' => 'Taller práctico', 'condition_id' => $condModalidad->id, 'next_condition_id' => $condParticipantes->id]);
        ConditionOption::create(['label' => 'Charla/Conferencia', 'condition_id' => $condModalidad->id, 'next_condition_id' => $condParticipantes->id]);

        $formacion->initial_condition_id = $condModalidad->id;
        $formacion->save();

        $this->command->info('✅ Datos de ejemplo creados exitosamente:');
        $this->command->info('   - 3 Unidades de Negocio (Auditoría, Consultoría, Formación)');
        $this->command->info('   - 6 Líneas de Gestión (HSEQ, SST, Gestión de Activos, etc.)');
        $this->command->info('   - ' . Service::count() . ' Servicios');
        $this->command->info('   - ' . Condition::count() . ' Condiciones con sus opciones');
    }
}
