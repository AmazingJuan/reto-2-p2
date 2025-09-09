import React, { useState, useRef } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { ClipboardList } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Desktop dropdowns (we use hover for desktop)
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);
  const [isServicesDropdownOpenMobile, setIsServicesDropdownOpenMobile] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Cotización
  const [quotationData, setQuotationData] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mostrar input al hacer click en la lupa
  const handleShowSearch = () => {
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // Cerrar barra de búsqueda
  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchTerm('');
  };

  // Fetch de cotizaciones (solo una definición)
  const fetchQuotationList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(route('list.index'), {
        withCredentials: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setQuotationData(response.data || []);
      setShowQuotationModal(true);
      console.log('Respuesta AJAX:', response.data);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar la lista de cotización');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuotationClick = (e) => {
    e?.preventDefault?.();
    fetchQuotationList();
    // Close mobile menu (if open) for better UX
    setIsMenuOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowQuotationModal(false);
    }
  };

  return (
    <>
      {/* Top info bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row lg:justify-between lg:items-center text-sm text-gray-600 space-y-2 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-1 lg:space-y-0">
            <span>Carrera 43A No 1 A - Sur 29 Edificio Colmena, oficina 315.</span>
            <span className="hover:text-blue-600 transition-colors">57 (604) 3223182</span>
            <span className="hover:text-blue-600 transition-colors">gerencia@trainingcorporation.com.co</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaFacebook size={18} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Intranet
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href={route('home')} className="flex-shrink-0">
              <img
                src="https://www.trainingcorporation.com.co/wp-content/uploads/thegem-logos/logo_2ca397275eaaf1aa60bbe0bda23053dc_1x.png"
                alt="Training Corporation"
                className="h-12 w-auto"
              />
            </a>

           {/* Desktop Nav */}
<nav className="hidden lg:flex items-center space-x-8">
  <a
    href={route('home')}
    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
  >
    Inicio
  </a>

  {/* Desktop dropdown: Nuestra empresa (hover) */}
  <div className="relative group">
    <button className="flex items-center font-medium text-gray-900 hover:text-blue-600 transition-colors">
      Nuestra empresa <ChevronDown className="ml-1 h-4 w-4" />
    </button>
    <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="py-2">
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
          Nuestro equipo
        </a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
          Sistema de Gestión Integrado
        </a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
          Contratistas
        </a>
      </div>
    </div>
  </div>

  {/* Desktop dropdown: Portafolio */}
  <div className="relative group">
    <a
      href={route('portfolio.index')}
      className="flex items-center font-medium text-gray-900 hover:text-blue-600 transition-colors"
    >
      Portafolio de servicios <ChevronDown className="ml-1 h-4 w-4" />
    </a>
    <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="py-2">
        <a
          href={route('services.index', { serviceTypeId: 'auditoria' })}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Auditoría
        </a>
        <a
          href={route('services.index', { serviceTypeId: 'formacion' })}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Formación
        </a>
        <a
          href={route('services.index', { serviceTypeId: 'consultoria' })}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Consultoría
        </a>
      </div>
    </div>
  </div>

  <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
    Actualidad
  </a>
  <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
    Clientes
  </a>
  <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
    Cursos y Formaciones
  </a>
  <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
    Contacto
  </a>

 <button
  onClick={handleQuotationClick}
  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
  title="Lista cotización"
>
  {isLoading ? (
    <span className="text-sm text-gray-500">...</span>
  ) : (
    <ClipboardList className="h-6 w-6 text-gray-600" />
  )}
</button>

  {/* Search 
  {!showSearch ? (
    <button
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      onClick={handleShowSearch}
    >
      <Search className="h-5 w-5 text-gray-600" />
    </button>
  ) : (
    <div className="relative">
      <input
        ref={searchInputRef}
        type="text"
        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring w-64"
        placeholder="Buscar servicios..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={handleCloseSearch}
        className="absolute right-1 top-1 text-gray-400 hover:text-gray-700"
      >
        <X className="h-5 w-5" />
      </button>

      {searchTerm && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-4 text-center text-gray-400">Sin resultados</div>
        </div>
      )}
    </div>
  )} 
*/}
</nav>


            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu (full) */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="px-4 space-y-4">
                <a
                  href={route('home')}
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Inicio
                </a>

                {/* Mobile dropdown: Nuestra empresa */}
                <div>
                  <button
                    onClick={() => setIsDropdownOpenMobile((s) => !s)}
                    className="flex items-center w-full justify-between font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    aria-expanded={isDropdownOpenMobile}
                  >
                    Nuestra empresa
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform transition-transform ${
                        isDropdownOpenMobile ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isDropdownOpenMobile && (
                    <div className="mt-2 pl-4 space-y-2">
                      <a
                        href="#"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Nuestro equipo
                      </a>
                      <a
                        href="#"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Sistema de Gestión Integrado
                      </a>
                      <a
                        href="#"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Contratistas
                      </a>
                    </div>
                  )}
                </div>

                {/* Mobile dropdown: Portafolio */}
                <div>
                  <button
                    onClick={() => setIsServicesDropdownOpenMobile((s) => !s)}
                    className="flex items-center w-full justify-between font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    aria-expanded={isServicesDropdownOpenMobile}
                  >
                    Portafolio de servicios
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform transition-transform ${
                        isServicesDropdownOpenMobile ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isServicesDropdownOpenMobile && (
                    <div className="mt-2 pl-4 space-y-2">
                      <a
                        href={route('services.index', { serviceTypeId: 'auditoria' })}
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Auditoría
                      </a>
                      <a
                        href={route('services.index', { serviceTypeId: 'formacion' })}
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Formación
                      </a>
                      <a
                        href={route('services.index', { serviceTypeId: 'consultoria' })}
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Consultoría
                      </a>
                    </div>
                  )}
                </div>

                <button
                    onClick={handleQuotationClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Lista cotización"
                  >
                    {isLoading ? (
                      <span className="text-sm text-gray-500">...</span>
                    ) : (
                      <ClipboardList className="h-6 w-6 text-gray-600" />
                    )}
                  </button>

                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Actualidad
                </a>
                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Clientes
                </a>
                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Cursos y Formaciones
                </a>
                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Contacto
                </a>

                {/* Search inside mobile menu */}
                <div className="pt-2">
                  {!showSearch ? (
                    <button
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      onClick={handleShowSearch}
                    >
                      <Search className="h-5 w-5 text-gray-600" />
                    </button>
                  ) : (
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring w-full"
                        placeholder="Buscar servicios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        onClick={handleCloseSearch}
                        className="absolute right-1 top-1 text-gray-400 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar/modal cotización */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          showQuotationModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-white h-full w-[28rem] shadow-2xl rounded-l-2xl transform transition-transform duration-300 ${
            showQuotationModal ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del sidebar */}
          <div className="flex justify-between items-center p-6 border-b rounded-tl-2xl bg-white">
            <h3 className="text-xl font-semibold text-gray-900">Lista de Cotización</h3>
            <button
              onClick={() => setShowQuotationModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="p-6 overflow-y-auto h-[calc(100%-120px)] bg-gray-50">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : quotationData.length > 0 ? (
              <ul className="space-y-6">
                {quotationData.map((item) => (
                  <li
                    key={item.id}
                    className="p-5 bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow"
                  >
                    {/* Type como título */}
                    {item.type && (
                      <h4 className="text-lg font-bold text-blue-600 mb-3 text-center uppercase tracking-wide">
                        {item.type}
                      </h4>
                    )}

                    {/* Servicios */}
                    <div className="mb-3">
                      <strong className="block text-gray-700 mb-1">Servicios:</strong>
                      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
                        {item.services?.map((service) => (
                          <li key={service.id}>{service.name}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Opciones */}
                    <div>
                      <strong className="block text-gray-700 mb-1">Opciones:</strong>
                      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
                        {item.options &&
                          Object.entries(item.options).map(([key, value]) => (
                            <li key={key}>
                              <span className="font-medium text-gray-800">{key}:</span>{' '}
                              {Array.isArray(value) ? (
                                value.join(', ')
                              ) : typeof value === 'object' && value !== null ? (
                                Object.keys(value).length === 1 ? (
                                  Object.values(value)[0]
                                ) : (
                                  JSON.stringify(value)
                                )
                              ) : (
                                value
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No hay elementos en la lista.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
