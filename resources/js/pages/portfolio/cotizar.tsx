import React, { useState, useCallback } from "react";
import Layout from "../../layouts/Layout";
import { route } from 'ziggy-js';
import axios from "axios";

type Flags = {
  allows_other_values: boolean;
  allows_multiple_values: boolean;
  is_time: boolean;
  is_fixed?: boolean;
};

type ConditionArrayItem = {
  name: string;
  description?: string;
  items: { value: string; next_condition_id: number | null }[];
  next_condition_id: number | null;
  flags: {
    allows_other_values: boolean;
    allows_multiple_values: boolean;
    is_time: boolean;
  };
};

interface ViewData {
  serviceType: string;
  serviceTypeId: string;
  serviceId: string | null;
  conditions?: Record<string, unknown>; // Mantenemos para compatibilidad hacia atrás
  conditionsArray?: { [key: number]: ConditionArrayItem };
  services?: { [key: string]: string };
  initialConditionId?: number;
  lineaGestion?: {
    name: string;
    items: string[];
    flags: {
      allows_other_values: boolean;
      allows_multiple_values: boolean;
      is_time: boolean;
      is_fixed: boolean;
    };
  };
}

interface CotizarProps {
  viewData: ViewData;
}

const Cotizar: React.FC<CotizarProps> = ({ viewData }) => {
  const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Estados para navegación del árbol de decisiones
  const [currentConditionId, setCurrentConditionId] = useState<number | null>(viewData.initialConditionId || null);
  const [conditionHistory, setConditionHistory] = useState<number[]>([]);
  const [conditionResponses, setConditionResponses] = useState<{ [conditionId: number]: string | string[] }>({});
  const [showFinalStep, setShowFinalStep] = useState(false);

  // Id to name mapping for services (compatible con ambas estructuras)
  const serviceIdNameMap = Object.entries(
    viewData.services || {}
  ).reduce(
    (acc, [id, name]) => ({ ...acc, [id]: name as string }),
    {} as Record<string, string>
  );

  const handleSelect = useCallback((section: string, value: string, flags: Flags) => {
    setResponses((prev) => {
      if (flags.allows_multiple_values) {
        const prevArray: string[] = Array.isArray(prev[section]) ? prev[section] as string[] : [];
        if (prevArray.includes(value)) {
          return { ...prev, [section]: prevArray.filter((v) => v !== value) };
        } else {
          return { ...prev, [section]: [...prevArray, value] };
        }
      } else {
        return { ...prev, [section]: value };
      }
    });
  }, []);

  // ===== FUNCIONES DE NAVEGACIÓN DEL ÁRBOL DE DECISIONES =====
  
  // Función para verificar si un servicio está seleccionado
  const isSelected = useCallback((section: string, value: string, flags: Flags): boolean => {
    if (!responses[section]) return false;
    if (flags.allows_multiple_values) {
      return Array.isArray(responses[section]) && (responses[section] as string[]).includes(value);
    } else {
      return responses[section] === value;
    }
  }, [responses]);
  
  // Obtiene la condición actual basada en currentConditionId
  const getCurrentCondition = useCallback(() => {
    if (!currentConditionId || !viewData.conditionsArray) return null;
    return viewData.conditionsArray[currentConditionId];
  }, [currentConditionId, viewData.conditionsArray]);

  // Maneja la selección de una opción en la condición actual
  const handleConditionSelect = useCallback((value: string, flags: Flags) => {
    if (!currentConditionId) return;

    setConditionResponses(prev => {
      if (flags.allows_multiple_values) {
        const prevArray: string[] = Array.isArray(prev[currentConditionId]) ? prev[currentConditionId] as string[] : [];
        if (prevArray.includes(value)) {
          return { ...prev, [currentConditionId]: prevArray.filter((v) => v !== value) };
        } else {
          return { ...prev, [currentConditionId]: [...prevArray, value] };
        }
      } else {
        return { ...prev, [currentConditionId]: value };
      }
    });
  }, [currentConditionId]);

  // Navega a la siguiente condición
  const navigateToNext = useCallback(() => {
    const currentCondition = getCurrentCondition();
    if (!currentCondition || !currentConditionId) return;

    // Verificar si hay respuesta seleccionada
    const currentResponse = conditionResponses[currentConditionId];
    if (!currentResponse) {
      setErrorMsg('Por favor selecciona una opción antes de continuar.');
      return;
    }

    // Si permite valores múltiples, verificar que hay al menos uno
    if (currentCondition.flags.allows_multiple_values && (!Array.isArray(currentResponse) || currentResponse.length === 0)) {
      setErrorMsg('Por favor selecciona al menos una opción.');
      return;
    }

    setErrorMsg(null);

    // Buscar el next_condition_id específico para la respuesta seleccionada
    let nextConditionId = null;

    if (currentCondition.flags.allows_multiple_values) {
      // Para múltiples valores, usar el next_condition_id general
      nextConditionId = currentCondition.next_condition_id;
    } else {
      // Para un solo valor, buscar en los items si tiene next_condition_id específico
      const selectedItem = currentCondition.items.find(item => item.value === currentResponse);
      nextConditionId = selectedItem?.next_condition_id || currentCondition.next_condition_id;
    }

    // Agregar condición actual al historial
    setConditionHistory(prev => [...prev, currentConditionId]);

    if (nextConditionId) {
      // Navegar a la siguiente condición
      setCurrentConditionId(nextConditionId);
    } else {
      // No hay más condiciones, mostrar paso final
      setShowFinalStep(true);
      setCurrentConditionId(null);
    }
  }, [getCurrentCondition, currentConditionId, conditionResponses]);

  // Navega hacia atrás en el árbol
  const navigateBack = useCallback(() => {
    if (conditionHistory.length === 0) return;

    const previousConditionId = conditionHistory[conditionHistory.length - 1];
    setConditionHistory(prev => prev.slice(0, -1));
    setCurrentConditionId(previousConditionId);
    setShowFinalStep(false);
    setErrorMsg(null);
  }, [conditionHistory]);

  // Verifica si una opción está seleccionada en la condición actual
  const isConditionOptionSelected = useCallback((value: string, flags: Flags): boolean => {
    if (!currentConditionId || !conditionResponses[currentConditionId]) return false;
    
    const response = conditionResponses[currentConditionId];
    if (flags.allows_multiple_values) {
      return Array.isArray(response) && response.includes(value);
    } else {
      return response === value;
    }
  }, [currentConditionId, conditionResponses]);

  // ===== FIN FUNCIONES DE NAVEGACIÓN =====

  // Data validation
  const validate = (servicesArr: { id: string; name: string }[]) => {
    if (!servicesArr.length) {
      setErrorMsg('Debes seleccionar al menos un servicio.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };
  
  const addToQuotationList = async () => {
    // Para el nuevo sistema de árbol de decisiones
    if (viewData.conditionsArray) {
      const { services: selectedServices, ...otherResponses } = responses;

      // Compilar las respuestas del árbol de decisiones
      const options: Record<string, string | string[] | number> = {};
      
      // Agregar línea de gestión si está seleccionada
      if (responses.lineaGestion) {
        options['Línea de gestión'] = responses.lineaGestion;
      }
      
      // Agregar respuestas del árbol de decisiones
      Object.entries(conditionResponses).forEach(([conditionId, value]) => {
        const condition = viewData.conditionsArray?.[parseInt(conditionId)];
        if (condition && condition.name) {
          options[condition.name] = value;
        }
      });

      // Agregar cualquier respuesta adicional del sistema anterior (para compatibilidad)
      Object.entries(otherResponses).forEach(([key, value]) => {
        if (key !== 'lineaGestion') { // Evitar duplicados
          options[key] = value;
        }
      });

      let servicesArr: { id: string; name: string }[] = [];
      if (Array.isArray(selectedServices)) {
        servicesArr = selectedServices
          .map((name: string) => {
            const id = Object.keys(serviceIdNameMap).find(
              (serviceId) => serviceIdNameMap[serviceId] === name
            );
            return id ? { id, name } : null;
          })
          .filter(Boolean) as { id: string; name: string }[];
      } else if (selectedServices) {
        const id = Object.keys(serviceIdNameMap).find(
          (serviceId) => serviceIdNameMap[serviceId] === selectedServices
        );
        if (id) servicesArr = [{ id, name: selectedServices }];
      }

      if (!validate(servicesArr)) return;

      setLoading(true);

      try {
        // 1. Initialize CSRF cookie (necessary with Sanctum in different domains)
        await axios.get("/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        // 2. Send form to backend
        await axios.post(
          route("list.add"),
          {
            services: servicesArr,
            options,
            serviceTypeId: viewData.serviceTypeId,
            serviceType: viewData.serviceType
          },
          { withCredentials: true }
        );

        alert("Cotización añadida a tu lista correctamente");

        // Reset del nuevo sistema
        setResponses({});
        setConditionResponses({});
        setCurrentConditionId(viewData.initialConditionId || null);
        setConditionHistory([]);
        setShowFinalStep(false);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            setErrorMsg(axiosError.response.data.message);
          } else {
            setErrorMsg("Error al añadir a la lista");
          }
        } else {
          setErrorMsg("Error al añadir a la lista");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // SISTEMA ANTERIOR (para compatibilidad)
      const { services: selectedServices, ...otherResponses } = responses;

      const options: Record<string, string | string[] | number> = {};
      
      // Agregar línea de gestión si está seleccionada
      if (responses.lineaGestion) {
        options['Línea de gestión'] = responses.lineaGestion;
      }
      
      Object.entries(otherResponses).forEach(([key, value]) => {
        if (key !== 'lineaGestion') { // Evitar duplicados
          options[key] = value;
        }
      });

      let servicesArr: { id: string; name: string }[] = [];
      if (Array.isArray(selectedServices)) {
        servicesArr = selectedServices
          .map((name: string) => {
            const id = Object.keys(serviceIdNameMap).find(
              (serviceId) => serviceIdNameMap[serviceId] === name
            );
            return id ? { id, name } : null;
          })
          .filter(Boolean) as { id: string; name: string }[];
      } else if (selectedServices) {
        const id = Object.keys(serviceIdNameMap).find(
          (serviceId) => serviceIdNameMap[serviceId] === selectedServices
        );
        if (id) servicesArr = [{ id, name: selectedServices }];
      }

      if (!validate(servicesArr)) return;

      setLoading(true);

      try {
        // 1. Initialize CSRF cookie (necessary with Sanctum in different domains)
        await axios.get("/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        // 2. Send form to backend
        await axios.post(
          route("list.add"),
          {
            services: servicesArr,
            options,
            serviceTypeId: viewData.serviceTypeId,
            serviceType: viewData.serviceType
          },
          { withCredentials: true }
        );

        alert("Cotización añadida a tu lista correctamente");

        setResponses({});
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            setErrorMsg(axiosError.response.data.message);
          } else {
            setErrorMsg("Error al añadir a la lista");
          }
        } else {
          setErrorMsg("Error al añadir a la lista");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Detalles de la cotización - {viewData.serviceType}
          </h2>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
          )}

          {/* LÍNEAS DE GESTIÓN */}
          {viewData.lineaGestion && (
            <div className="mb-8 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                {viewData.lineaGestion.name}
                {viewData.lineaGestion.flags.allows_multiple_values && " (seleccione uno o más)"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {viewData.lineaGestion.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={isSelected("lineaGestion", item, viewData.lineaGestion!.flags)}
                    onClick={() => handleSelect("lineaGestion", item, viewData.lineaGestion!.flags)}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-center text-sm ${
                      isSelected("lineaGestion", item, viewData.lineaGestion!.flags)
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {item}
                    {isSelected("lineaGestion", item, viewData.lineaGestion!.flags) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Árbol de decisiones */}

          {viewData.conditionsArray && (
            <div className="mb-8">
              {!showFinalStep && currentConditionId ? (
                <>
                  {/* Progreso del árbol */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Paso {conditionHistory.length + 1}
                      </span>
                      {conditionHistory.length > 0 && (
                        <button
                          onClick={navigateBack}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          ← Volver atrás
                        </button>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((conditionHistory.length + 1) / Object.keys(viewData.conditionsArray).length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

              {/* Condición actual */}
              {(() => {
                const currentCondition = getCurrentCondition();
                if (!currentCondition) return null;

                return (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                      {currentCondition.name}
                      {currentCondition.flags.allows_multiple_values && " (seleccione uno o más)"}
                    </h3>

                    {/* Descripción de la condición */}
                    {currentCondition.description && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Nota:</span> {currentCondition.description}
                        </p>
                      </div>
                    )}

                    {/* Condición de tiempo */}
                    {currentCondition.flags.is_time ? (
                      <div className="space-y-4">
                        <input
                          type="number"
                          min="1"
                          placeholder="Ingrese el número de días"
                          value={conditionResponses[currentConditionId] || ''}
                          onChange={(e) => setConditionResponses(prev => ({
                            ...prev,
                            [currentConditionId]: e.target.value
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : currentCondition.items.length === 0 ? (
                      // Campo numérico genérico (ej: Número de funcionarios entrevistados)
                      <div className="space-y-4">
                        <input
                          type="number"
                          min="0"
                          placeholder="Ingrese el número"
                          value={conditionResponses[currentConditionId] || ''}
                          onChange={(e) => setConditionResponses(prev => ({
                            ...prev,
                            [currentConditionId]: e.target.value
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      /* Opciones normales (con filtrado condicional) */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(() => {
                          let itemsToRender = currentCondition.items;
                          if (currentCondition.name === 'Selección de profesionales') {
                            const initialResponse = conditionResponses[viewData.initialConditionId || -1];
                            if (initialResponse !== 'Auditoría interna (ISO 9001, 14001, 45001, 37001, 55001)') {
                              itemsToRender = itemsToRender.filter(i => i.value !== 'Especialidad según norma ISO');
                            }
                          }
                          return itemsToRender.map((item, index) => (
                            <button
                              key={index}
                              type="button"
                              aria-pressed={isConditionOptionSelected(item.value, currentCondition.flags)}
                              onClick={() => handleConditionSelect(item.value, currentCondition.flags)}
                              className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                                isConditionOptionSelected(item.value, currentCondition.flags)
                                  ? "bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm"
                                  : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {item.value}
                              {isConditionOptionSelected(item.value, currentCondition.flags) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ));
                        })()}
                      </div>
                    )}

                    {/* Botón para continuar */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={navigateToNext}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Continuar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })()}
                </>
              ) : showFinalStep ? null : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {viewData.conditionsArray ? 'Iniciando proceso de cotización...' : 'No hay condiciones configuradas para este tipo de servicio.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paso final - Selección de servicios cuando se termina el árbol */}
          {showFinalStep && (
            <div className="mb-8 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                ¡Perfecto! Ahora selecciona los servicios que necesitas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(viewData.services || {}).map(([id, name]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isSelected("services", name as string, {
                      allows_multiple_values: true,
                      allows_other_values: false,
                      is_time: false,
                      is_fixed: true,
                    })}
                    onClick={() => handleSelect("services", name as string, {
                      allows_multiple_values: true,
                      allows_other_values: false,
                      is_time: false,
                      is_fixed: true,
                    })}
                    className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                      isSelected("services", name as string, {
                        allows_multiple_values: true,
                        allows_other_values: false,
                        is_time: false,
                        is_fixed: true,
                      })
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {name as string}
                    {isSelected("services", name as string, {
                      allows_multiple_values: true,
                      allows_other_values: false,
                      is_time: false,
                      is_fixed: true,
                    }) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={navigateBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Volver a revisar opciones
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={addToQuotationList}
              disabled={loading}
              className={`px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {loading ? "Enviando..." : "Añadir a lista de cotización"}
            </button>

            <button
              type="button"
              onClick={() => alert("¡Solicitud de cotización enviada!")}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Cotizar ahora
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información importante
          </h3>
          <p className="text-blue-700 text-sm">
            Una vez que envíe su solicitud, nos contactaremos con usted para proporcionarle una cotización detallada según sus requerimientos.
          </p>
        </div> 
      </div>
    </Layout>
  );
};

export default Cotizar;