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

interface GestionLine {
  id: number;
  name: string;
}

interface Service {
  id: string;
  name: string;
  gestion_line_id: number;
}

interface ViewData {
  serviceType: string;
  serviceTypeId: string;
  serviceId: string | null;
  conditionsArray?: { [key: number]: ConditionArrayItem };
  services?: Service[];
  initialConditionId?: number;
  gestionLines?: GestionLine[];
}

interface CotizarProps {
  viewData: ViewData;
}

const Cotizar: React.FC<CotizarProps> = ({ viewData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Estado para la línea de gestión seleccionada
  const [selectedGestionLineId, setSelectedGestionLineId] = useState<number | null>(null);
  
  // Estado para servicios seleccionados
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Estados para navegación del árbol de condiciones
  const [currentConditionId, setCurrentConditionId] = useState<number | null>(null);
  const [conditionHistory, setConditionHistory] = useState<number[]>([]);
  const [conditionResponses, setConditionResponses] = useState<{ [conditionId: number]: string | string[] }>({});
  const [showConditionsTree, setShowConditionsTree] = useState(false);

  // Servicios filtrados por línea de gestión
  const filteredServices = selectedGestionLineId 
    ? (viewData.services || []).filter(service => service.gestion_line_id === selectedGestionLineId)
    : [];

  // Maneja la selección de línea de gestión
  const handleGestionLineSelect = useCallback((gestionLineId: number) => {
    setSelectedGestionLineId(gestionLineId);
    setSelectedServices([]);
    setShowConditionsTree(false);
    setCurrentConditionId(null);
    setConditionHistory([]);
    setConditionResponses({});
    setErrorMsg(null);
  }, []);

  // Maneja la selección de servicios

  const handleServiceToggle = useCallback((serviceId: string) => {
    setSelectedServices(prev => {
      const newSelected = prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      if (newSelected.length > 0 && !showConditionsTree) {
        setShowConditionsTree(true);
        setCurrentConditionId(viewData.initialConditionId || null);
      } else if (newSelected.length === 0) {
        setShowConditionsTree(false);
        setCurrentConditionId(null);
        setConditionHistory([]);
        setConditionResponses({});
      }
      
      return newSelected;
    });
  }, [showConditionsTree, viewData.initialConditionId]);

  // Funciones de navegación del árbol de condiciones
  
  // Obtiene la condición actual
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
      // No hay más condiciones, fin del árbol
      setCurrentConditionId(null);
    }
  }, [getCurrentCondition, currentConditionId, conditionResponses]);

  // Navega hacia atrás en el árbol
  const navigateBack = useCallback(() => {
    if (conditionHistory.length === 0) {
      // Si no hay historial, volver a servicios
      setShowConditionsTree(false);
      setCurrentConditionId(null);
      setConditionResponses({});
      setErrorMsg(null);
      return;
    }

    const previousConditionId = conditionHistory[conditionHistory.length - 1];
    setConditionHistory(prev => prev.slice(0, -1));
    setCurrentConditionId(previousConditionId);
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


  // Validación de datos
  const validate = (servicesArr: { id: string; name: string }[]) => {
    if (!servicesArr.length) {
      setErrorMsg('Debes seleccionar al menos un servicio.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };
  
  const addToQuotationList = async () => {
    const options: Record<string, string | string[] | number> = {};
    
    // Agregar línea de gestión seleccionada
    
    // Agregar respuestas del árbol de condiciones
    Object.entries(conditionResponses).forEach(([conditionId, value]) => {
      const condition = viewData.conditionsArray?.[parseInt(conditionId)];
      if (condition && condition.name) {
        options[condition.name] = value;
      }
    });

    // Construir array de servicios
    const servicesArr: { id: string; name: string }[] = selectedServices
      .map((serviceId) => {
        const service = viewData.services?.find(s => s.id === serviceId);
        return service ? { id: service.id, name: service.name } : null;
      })
      .filter(Boolean) as { id: string; name: string }[];

    if (!validate(servicesArr)) return;

    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const gestionLine = selectedGestionLineId
        ? viewData.gestionLines?.find(gl => gl.id === selectedGestionLineId)
        : undefined;

      await axios.post(
        route("list.add"),
          {
            services: servicesArr,
            options,
            service_type_id: viewData.serviceTypeId,
            service_type: viewData.serviceType,
            // usar ":" para asignar en el objeto y enviar snake_case
            gestion_line: gestionLine?.name ?? null,
            gestion_line_id: selectedGestionLineId ?? null,
          },
        { withCredentials: true }
      );

      alert("Cotización añadida a tu lista correctamente");

      setSelectedGestionLineId(null);
      setSelectedServices([]);
      setConditionResponses({});
      setCurrentConditionId(null);
      setConditionHistory([]);
      setShowConditionsTree(false);
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

          {!selectedGestionLineId && viewData.gestionLines && viewData.gestionLines.length > 0 && (
            <div className="mb-8 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                ¿Qué línea de gestión te interesa?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {viewData.gestionLines.map((gestionLine) => (
                  <button
                    key={gestionLine.id}
                    type="button"
                    onClick={() => handleGestionLineSelect(gestionLine.id)}
                    className="p-4 rounded-lg border border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center text-sm font-medium"
                  >
                    {gestionLine.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/** Filtro de las líneas de gestión */}
          {selectedGestionLineId && (
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Línea: {viewData.gestionLines?.find(gl => gl.id === selectedGestionLineId)?.name}
              </span>
              <button
                onClick={() => setSelectedGestionLineId(null)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cambiar
              </button>
            </div>
          )}

          {/** Seleccionar servicios filtrados */}

          {selectedGestionLineId && (
            <div className="mb-8 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Selecciona los servicios que necesitas
              </h3>

              {/** Arbol de condiciones */}

              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {filteredServices.map((service) => (
                    <label
                      key={service.id}
                      className={`group flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                        selectedServices.includes(service.id)
                          ? "bg-blue-50 border-blue-500 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                        <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </span>
                      </div>

                      {selectedServices.includes(service.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay servicios disponibles para esta línea de gestión.
                </div>
              )}
            </div>
          )}

          {showConditionsTree && viewData.conditionsArray && (
            <div className="mb-8 rounded-xl border border-gray-200 p-6">
              {currentConditionId ? (
                <>
                  {/* Progreso */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                        <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </span>
                        Información adicional
                      </h3>
                      <button
                        onClick={navigateBack}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        ← Volver
                      </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
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
                          <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        ) : currentCondition.items.length === 0 ? (
                          // Campo numérico genérico
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
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        ) : (
                          /* Opciones normales */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentCondition.items.map((item, index) => (
                              <button
                                key={index}
                                type="button"
                                aria-pressed={isConditionOptionSelected(item.value, currentCondition.flags)}
                                onClick={() => handleConditionSelect(item.value, currentCondition.flags)}
                                className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                                  isConditionOptionSelected(item.value, currentCondition.flags)
                                    ? "bg-green-50 border-green-500 text-green-700 font-medium shadow-sm"
                                    : "border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50"
                                }`}
                              >
                                {item.value}
                                {isConditionOptionSelected(item.value, currentCondition.flags) && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Botón para continuar */}
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={navigateToNext}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
              ) : (
                /* Fin del cuestionario */
                <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    ¡Información completada!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ya tienes todo listo. Ahora puedes agregar esta cotización a tu lista o enviarla directamente.
                  </p>
                  <button
                    onClick={navigateBack}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    ← Revisar información
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={addToQuotationList}
              disabled={loading || selectedServices.length === 0}
              className={`px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center ${
                loading || selectedServices.length === 0 ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-700"
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
              disabled={selectedServices.length === 0}
              className={`px-8 py-3 font-semibold rounded-lg shadow-md transition-all transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center ${
                selectedServices.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5"
              }`}
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