import React, { useState } from "react";
import Layout from "../../layouts/Layout";
import { route } from 'ziggy-js';
type Flags = {
  allows_other_values: boolean;
  allows_multiple_values: boolean;
  is_time: boolean;
  is_fixed: boolean;
};

type ConditionItem = {
  flags: Flags;
  items: string[];
};

interface ViewData {
  serviceType: string;
  serviceId: string | null;
  conditions: any;
}

interface CotizarProps {
  viewData: ViewData;
}

const Cotizar: React.FC<CotizarProps> = ({ viewData }) => {
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [otherInputs, setOtherInputs] = useState<{ [key: string]: boolean }>({});
  const [dynamicSedes, setDynamicSedes] = useState<{ [key: string]: string[] }>({});

  // Mapeo de id a nombre para los servicios
  const serviceIdNameMap = Object.entries(viewData.conditions.services || {}).reduce(
    (acc, [id, name]) => ({ ...acc, [id]: name }),
    {} as Record<string, string>
  );

  const handleSelect = (section: string, value: string, flags: Flags) => {
    setResponses((prev) => {
      if (flags.allows_multiple_values) {
        const prevArray: string[] = prev[section] || [];
        if (prevArray.includes(value)) {
          return { ...prev, [section]: prevArray.filter((v) => v !== value) };
        } else {
          return { ...prev, [section]: [...prevArray, value] };
        }
      } else {
        return { ...prev, [section]: value };
      }
    });
  };

  const handleOther = (section: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), other: value },
    }));
  };

  const handleTime = (section: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), time: value },
    }));
  };

  const toggleOtherInput = (section: string) => {
    setOtherInputs((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
    if (!otherInputs[section]) {
      setResponses((prev) => ({
        ...prev,
        [section]: { ...(prev[section] || {}), isOther: true },
      }));
    }
  };

  const isSelected = (section: string, value: string, flags: Flags): boolean => {
    if (!responses[section]) return false;
    if (flags.allows_multiple_values) {
      return Array.isArray(responses[section]) && responses[section].includes(value);
    } else {
      return responses[section] === value || (responses[section] && responses[section].isOther);
    }
  };

  // Sedes dinámicas por sección
  const addSedeField = (sectionName: string) => {
    setDynamicSedes(prev => ({
      ...prev,
      [sectionName]: [...(prev[sectionName] || [""]), ""]
    }));
  };

  const removeSedeField = (sectionName: string, index: number) => {
    setDynamicSedes(prev => {
      const newSedes = (prev[sectionName] || [""]).filter((_, i) => i !== index);
      return { ...prev, [sectionName]: newSedes.length ? newSedes : [""] };
    });
    setResponses(prev => ({
      ...prev,
      [sectionName]: (dynamicSedes[sectionName] || [""]).filter((_, i) => i !== index).filter(sede => sede.trim() !== "")
    }));
  };

  const updateSedeField = (sectionName: string, index: number, value: string) => {
    setDynamicSedes(prev => {
      const newSedes = (prev[sectionName] || [""]).map((sede, i) => i === index ? value : sede);
      return { ...prev, [sectionName]: newSedes };
    });
    setResponses(prev => ({
      ...prev,
      [sectionName]: (dynamicSedes[sectionName] || [""]).map((sede, i) => i === index ? value : sede).filter(sede => sede.trim() !== "")
    }));
  };

  // Separa servicios del resto de condiciones
  const { services, ...otherConditions } = viewData.conditions;

  const addToQuotationList = async () => {
    const { services: selectedServices, ...otherResponses } = responses;

  const options: Record<string, any> = {};
    Object.entries(otherResponses).forEach(([key, value]) => {
      options[key] = value;
    });

    let servicesArr: { id: string; name: string }[] = [];
    if (Array.isArray(selectedServices)) {
      servicesArr = selectedServices
        .map((name: string) => {
          // Buscar el id por el nombre
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

    const payload = {
      services: servicesArr,
      options,
    };

    try {
      const response = await fetch(route('list.add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Cotización añadida a tu lista correctamente');
      } else {
        alert('Error al añadir a la lista');
      }
    } catch (error) {
      alert('Error de red al añadir a la lista');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Detalles de la cotización
          </h2>
          
          {/* Servicios - Selección múltiple */}
          {services && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Servicios requeridos (seleccione uno o más)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(services).map(([id, name]) => (
                  <button
                    key={id}
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
            </div>
          )}

          {/* Otras condiciones */}
          {Object.values(otherConditions).map((conditionBlock, idx) => {
            const sectionName = Object.keys(conditionBlock)[0];
            const section: ConditionItem = conditionBlock[sectionName];
            const effectiveFlags = section.flags;

            return (
              <div key={sectionName} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  {sectionName}
                  {effectiveFlags.allows_multiple_values && " (seleccione uno o más)"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSelect(sectionName, item, effectiveFlags)}
                      className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                        isSelected(sectionName, item, effectiveFlags)
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {item}
                      {isSelected(sectionName, item, effectiveFlags) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                  
                  {/* Botón "Otro" para modalidad */}
                  {effectiveFlags.allows_other_values && (
                    <div className="flex flex-col">
                      <button
                        onClick={() => toggleOtherInput(sectionName)}
                        className={`p-4 rounded-lg border transition-all flex items-center justify-center mb-2 ${
                          otherInputs[sectionName] || (responses[sectionName] && responses[sectionName].isOther)
                            ? "bg-blue-100 border-blue-500 text-blue-700 font-medium shadow-sm"
                            : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        Otro
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      
                      {(otherInputs[sectionName] || (responses[sectionName] && responses[sectionName].isOther)) && (
                        <div className="md:col-span-2 mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Especifique otra modalidad</label>
                          <input
                            type="text"
                            placeholder="Describa su modalidad..."
                            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={responses[sectionName]?.other || ""}
                            onChange={(e) => handleOther(sectionName, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Campo de tiempo */}
                  {effectiveFlags.is_time && (
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Ej: 2 horas, 3 días, etc."
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={responses[sectionName]?.time || ""}
                        onChange={(e) => handleTime(sectionName, e.target.value)}
                      />
                    </div>
                  )}
                  {/* Sedes dinámicas */}
                  {!(effectiveFlags.is_fixed) && (
                    <div className="md:col-span-2">
                      {(dynamicSedes[sectionName] || [""]).map((sede, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            placeholder={`Nombre sede ${index + 1}`}
                            className="flex-1 border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={sede}
                            onChange={(e) => updateSedeField(sectionName, index, e.target.value)}
                          />
                          {(dynamicSedes[sectionName]?.length ?? 1) > 1 && (
                            <button
                              onClick={() => removeSedeField(sectionName, index)}
                              className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                              type="button"
                              title="Eliminar sede"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      {/* Botón para añadir más sedes */}
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => addSedeField(sectionName)}
                          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
                          type="button"
                          title="Añadir otra sede"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={addToQuotationList}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Añadir a lista de cotización
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
            Una vez que envíe su solicitud, nos contactaremos con usted dentro de las próximas 24 horas para proporcionarle una cotización detallada según sus requerimientos.
          </p>
        </div> 
      </div>
    </Layout>
  );
};

export default Cotizar;