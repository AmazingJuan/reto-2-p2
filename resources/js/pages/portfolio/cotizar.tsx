// resources/js/Pages/portfolio/cotizar.tsx
import React, { useState } from "react";
import Layout from "../../layouts/Layout";

type Flags = {
  allows_other_value: boolean;
  allows_multiple_values: boolean;
  is_time: boolean;
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
    
    // Si estamos abriendo el campo "Otro", seleccionar la opción "Otro"
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
      return responses[section].includes(value);
    } else {
      return responses[section] === value || (responses[section] && responses[section].isOther);
    }
  };

  return (
    <Layout
      heroContent={
        <div className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h1 className="text-4xl font-bold mb-2">Cotización de {viewData.serviceType}</h1>
          <p className="text-xl opacity-90">Complete los detalles para recibir su cotización personalizada</p>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Detalles de la cotización
          </h2>
          
          {/* Servicios - Selección múltiple */}
          {viewData.conditions.services && (
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
                {Object.entries(viewData.conditions.services).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => handleSelect("services", name as string, {
                      allows_multiple_values: true,
                      allows_other_value: false,
                      is_time: false,
                    })}
                    className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                      isSelected("services", name as string, {allows_multiple_values: true, allows_other_value: false, is_time: false})
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {name as string}
                    {isSelected("services", name as string, {allows_multiple_values: true, allows_other_value: false, is_time: false}) && (
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
          {Object.entries(viewData.conditions).map(([key, value]) => {
            if (key === "services") return null;
            
            const sectionName = Object.keys(value)[0];
            const section: ConditionItem = value[sectionName];
            
            // Forzar selección múltiple para viáticos
            const effectiveFlags = sectionName.toLowerCase().includes("viatic") ? 
              { ...section.flags, allows_multiple_values: true } : 
              section.flags;
            
            return (
              <div key={key} className="mb-8">
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
                  {effectiveFlags.allows_other_value && (
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo estimado</label>
                      <input
                        type="text"
                        placeholder="Ej: 2 horas, 3 días, etc."
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={responses[sectionName]?.time || ""}
                        onChange={(e) => handleTime(sectionName, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
  <button
    onClick={() => console.log("Añadir a lista:", responses)}
    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
    Añadir a lista de cotización
  </button>
  
  <button
    onClick={() => console.log("Cotizar ahora:", responses)}
    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
            Una vez que envíe su solicitud, nos contactaremos con usted dentro de las próximas 24 horas para proporcionarle una cotización detallada según sus requerimientos.
          </p>
        </div> 
      </div>
    </Layout>
  );
};

export default Cotizar;