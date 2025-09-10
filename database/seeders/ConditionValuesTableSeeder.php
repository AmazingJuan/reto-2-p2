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
/*        
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
*/

        // LINEA DE GESTIÓN

        $linea_gestion_id = Condition::where('name', 'Línea de Gestión')->first()->id;

        // Valores para todos los servicios

        $values_linea_gestion = ['Gestión de activos', 'Sostenibilidad ambiental', 'Eficiencia energética', 'Gestión calidad', 'Gestión de SST', 'Servicios regulatorios', 'HSEQ', 'Seguridad de la información y ciberseguridad', 'Laboratorio'];

        foreach ($values_linea_gestion as $value) {

            ConditionValue::create([
                'condition_id' => $linea_gestion_id,
                'value' => $value,
            ]);
        }

        // TIPO DE SERVICIO

        $tipo_servicio_id = Condition::where('name', 'Tipo de servicio')->first()->id;
        
        // Valores Auditoría 
        
        $values_tipo_servicio_auditoria = ['Auditoría interna (ISO 9001, 14001, 45001, 37001, 55001)', 'Auditoría de segunda parte (proveedores)', 'Pre-auditoría (ensayo de certificación)'];
        
        // Valores Consultoría
        
        $values_tipo_servicio_consultoria = ['Implementación de sistemas de gestión (ISO 9001, 14001, 45001, 37001, 55001)', 'Gestión de riesgos y continuidad del negocio (ISO 31000, BCM)', 'Sostenibilidad y ESG (huella de carbono, economía circular, RSE)', 'Fortalecimiento de procesos y mejora continua'];

        // Valores de las condiciones creados

        foreach ($values_tipo_servicio_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $tipo_servicio_id,
                'value' => $value,
                'service_type' => 'auditoria',
            ]);
        }

        foreach ($values_tipo_servicio_consultoria as $value) {
            ConditionValue::create([
                'condition_id' => $tipo_servicio_id,
                'value' => $value,
                'service_type' => 'consultoria',
            ]);
        }

        // ESTANDAR APLICABLE

        $norma_id = Condition::where('name', 'Norma')->first()->id;

        // Valores Auditoría

        $values_norma_auditoria = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 37001', 'ISO 55001'];

        // Valores Consultoría

        $values_norma_consultoria = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 37001', 'ISO 31000', 'ISO 55001', 'Estándares de sostenibilidad y carbono neutralidad'];

        // Valores de las condiciones creados

        foreach ($values_norma_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $norma_id,
                'value' => $value,
                'service_type' => 'auditoria',
            ]);
        }
        
        foreach ($values_norma_consultoria as $value) {
            ConditionValue::create([
                'condition_id' => $norma_id,
                'value' => $value,
                'service_type' => 'consultoria',
            ]);
        }

        // MODALIDAD DE PRESTACIÓN

        $modalidad_id = Condition::where('name', 'Modalidad')->first()->id;

        // Valores para todos los servicios

        $values_modalidad = ['Presencial', 'Virtual (documental)', 'Híbrida (Mixta)'];

        foreach ($values_modalidad as $value) {
            ConditionValue::create([
                'condition_id' => $modalidad_id,
                'value' => $value,
            ]);
        }

        // DURACIÓN Y DEDICACIÓN

        $duracion_id = Condition::where('name', 'Duración')->first()->id;

        // Valores Auditoría

        $values_duracion_auditoria = ['1 a 2 días (Pymes)', '3 a 5 días (empresas medianas)', '>5 días (empresas grandes/multisede)'];
        
        // Valores Consultoría

        $values_duracion_consultoria = ['Diagnóstico: 8–16 horas', 'Implementación: 40–160 horas', 'Acompañamiento a certificación: 80–120 horas'];
        
        // Crear valores de las condiciones

        foreach ($values_duracion_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $duracion_id,
                'value'        => $value,
                'service_type' => 'auditoria',
            ]);
        }

        foreach ($values_duracion_consultoria as $value) {
            ConditionValue::create([
                'condition_id' => $duracion_id,
                'value'        => $value,
                'service_type' => 'consultoria',
            ]);
        }

        // VIÁTICOS Y LOGÍSTICA

        $viaticos_id = Condition::where('name', 'Viaticos')->first()->id;

        // Valores y condiciones para todos los servicios

        $values_viaticos_auditoria = ['Transporte', 'Hospedaje', 'Alimentación'];
        
        foreach ($values_viaticos_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $viaticos_id,
                'value'        => $value,
            ]);
        }

        // PARTICIPANTES Y COBERTURA

        $participantes_id = Condition::where('name', 'Participantes')->first()->id;

        // =================FALTA==============

        // ENTREGABLES

        $entregables_id = Condition::where('name', 'Entregables')->first()->id;

        // Valores Auditoría

        $values_entregables_auditoria = ['Informe de hallazgos', 'Plan de acción', 'Informe ejecutivo para gerencia'];

        // Valores Consultoría

        $values_entregables_consultoria = ['Diagnóstico inicial', 'Plan de implementación', 'Documentación de procesos/procedimientos', 'Indicadores de seguimiento', 'Informe final y plan de mejora'];

        // Valores de las condiciones creados 

        foreach ($values_entregables_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $entregables_id,
                'value'        => $value,
                'service_type' => 'auditoria',
            ]);
        }

        foreach ($values_entregables_consultoria as $value) {
            ConditionValue::create([
                'condition_id' => $entregables_id,
                'value'        => $value,
                'service_type' => 'consultoria',
            ]);
        }

        // SELECCIÓN DE PROFESIONAL

        $profesional_id = Condition::where('name', 'Seleccion de profesional')->first()->id;

        // Valores para Auditoría

        $values_profesional_auditoria = ['Auditores líderes / internos certificados', 'Experiencia mínima: 5 años', 'Especialidad según norma ISO'];

        // Valores para consultoría

        $values_profesional_consultoria = ['Consultores junior, senior o expertos', 'Asignación según experiencia en norma/sector', 'Disponibilidad geográfica'];

        // Creación de los valores para las condiciones

        foreach ($values_profesional_auditoria as $value) {
            ConditionValue::create([
                'condition_id' => $profesional_id,
                'value'        => $value,
                'service_type' => 'auditoria',
            ]);
        }

        foreach ($values_profesional_consultoria as $value) {
            ConditionValue::create([
                'condition_id' => $profesional_id,
                'value'        => $value,
                'service_type' => 'consultoria',
            ]);
        }
    }
}