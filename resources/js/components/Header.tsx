import React, { useState, useRef } from 'react';
import { route } from 'ziggy-js';
// import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [quotationData, setQuotationData] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);

  // Mostrar input al hacer click en la lupa
  const handleShowSearch = () => {
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };
  
  // Cerrar barra de búsqueda
  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchTerm("");
  };

  // Función para obtener la lista de cotización
  const fetchQuotationList = () => {
    setIsLoading(true);
    
    fetch(route('list.index'), {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        console.log("Respuesta AJAX:", data);
        setQuotationData(data || []);
        setShowQuotationModal(true);
      })
      .catch(err => {
        console.error("Error:", err);
        alert('Error al cargar la lista de cotización');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Función para manejar el clic en Lista cotización
  const handleQuotationClick = (e) => {
    e.preventDefault();
    fetchQuotationList();
  };

  // Cerrar el sidebar cuando se hace clic fuera de él
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowQuotationModal(false);
    }
  };

  return (
    <>
      {/* Barrita de Encima con información Training */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center text-sm text-gray-600 space-y-2 lg:space-y-0">
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-1 lg:space-y-0">
              <span>Carrera 43A No 1 A - Sur 29 Edificio Colmena, oficina 315.</span>
              <a className="hover:text-blue-600 transition-colors">57 (604) 3223182</a>
              <a className="hover:text-blue-600 transition-colors">gerencia@trainingcorporation.com.co</a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <FaFacebook size={18} />
                </a>
                <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <FaLinkedin size={18} />
                </a>
              </div>
              <a target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                Intranet
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Training*/}
            <a href={route('home')} className="flex-shrink-0">
              <img 
                src="https://www.trainingcorporation.com.co/wp-content/uploads/thegem-logos/logo_2ca397275eaaf1aa60bbe0bda23053dc_1x.png" 
                alt="Training Corporation" 
                className="h-12 w-auto"
              />
            </a>

            {/* Navegación */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href={route('home')} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                Inicio
              </a>
              
              <div className="relative group">
                <button className="flex items-center font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  Nuestra empresa
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Nuestro equipo</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Sistema de Gestión Integrado</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Contratistas</a>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <a href={route('portfolio.index')} className="flex items-center font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  Portafolio de servicios
                  <ChevronDown className="ml-1 h-4 w-4" />
                </a>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href={route('services.index', { serviceTypeId: 'auditoria' })} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Auditoría</a>
                    <a href={route('services.index', { serviceTypeId: 'formacion' })} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Formación</a>
                    <a href={route('services.index', { serviceTypeId: 'consultoria' })} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Consultoría</a>
                  </div>
                </div>
              </div>
              
              <a
                href="#"
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={handleQuotationClick}
              >
                {isLoading ? 'Cargando...' : 'Lista cotización'}
              </a>
              
              <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">Actualidad</a>
              <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">Clientes</a>
              <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">Cursos y Formaciones</a>
              <a href="#" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">Contacto</a>
              
              {!showSearch ? (
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={handleShowSearch}>
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
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <button onClick={handleCloseSearch} className="absolute right-1 top-1 text-gray-400 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                  {/* Resultados de búsqueda */}
                  {searchTerm && (
                    <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                      <div className="p-4 text-center text-gray-400">Sin resultados</div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                <a href={route('home')} className="block font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  Inicio
                </a>
                
                <div>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center w-full font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    Nuestra empresa
                    <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 pl-4 space-y-2">
                      <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Nuestro equipo</a>
                      <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Sistema de Gestión Integrado</a>
                      <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Contratistas</a>
                    </div>
                  )}
                </div>

                <div>
                  <button 
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className="flex items-center w-full font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    <a href={route('portfolio.index')} className="flex items-center">
                      Portafolio de servicios
                      <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </a>
                  </button>
                  {isServicesDropdownOpen && (
                    <div className="mt-2 pl-4 space-y-2">
                      <a href={route('services.index', { serviceTypeId: 'auditoria' })} className="block text-gray-700 hover:text-blue-600 transition-colors">Auditoría</a>
                      <a href={route('services.index', { serviceTypeId: 'formacion' })} className="block text-gray-700 hover:text-blue-600 transition-colors">Formación</a>
                      <a href={route('services.index', { serviceTypeId: 'consultoria' })} className="block text-gray-700 hover:text-blue-600 transition-colors">Consultoría</a>
                    </div>
                  )}
                </div>

                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={handleQuotationClick}
                >
                  {isLoading ? 'Cargando...' : 'Lista cotización'}
                </a>

                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600 transition-colors">Actualidad</a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600 transition-colors">Clientes</a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600 transition-colors">Cursos y Formaciones</a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600 transition-colors">Contacto</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar para mostrar la lista de cotización */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          showQuotationModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-white h-full w-96 shadow-xl transform transition-transform duration-300 ${
            showQuotationModal ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Lista de Cotización</h3>
            <button
              onClick={() => setShowQuotationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 overflow-y-auto h-[calc(100%-120px)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : quotationData && quotationData.length > 0 ? (
              <ul className="space-y-4">
                {quotationData.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 border rounded shadow-sm bg-gray-50"
                  >
                    <strong>ID:</strong> {item.id} <br />
                    <strong>Servicios:</strong> {item.services} <br />
                    <strong>Opciones:</strong> {item.options}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay elementos en la lista.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;