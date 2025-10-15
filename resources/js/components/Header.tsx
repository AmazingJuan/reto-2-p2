import React, { useState, useRef } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { Menu, X, Search, ChevronDown, ClipboardList, Shield, User } from 'lucide-react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';


const Header = () => {
  
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);
  const [isServicesDropdownOpenMobile, setIsServicesDropdownOpenMobile] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchQuotationList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(route('list.index'));
      setQuotationData(response.data || []);
      setShowQuotationModal(true);
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
    setIsMenuOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowQuotationModal(false);
    }
  };

  const handleDeleteService = async (id) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este servicio?');
    if (!confirmDelete) return;

    try {
      await axios.delete(route('list.destroy', id));
      setQuotationData((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage('Cotización borrada exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      alert('Error al eliminar el servicio');
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
            <span className="hover:text-blue-600 transition-colors">
              gerencia@trainingcorporation.com.co
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a className="text-blue-600 hover:text-blue-800 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a className="text-blue-600 hover:text-blue-800 transition-colors">
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
              <a href={route('home')} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                Inicio
              </a>

              {/* Nuestra empresa */}
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

              {/* Portafolio */}
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

              {/* Botón cotización */}
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

              {/* 👤 Panel de usuario */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all shadow-sm"
              title="Panel de usuario"
            >
              <User className="h-5 w-5" />
            </button>

            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                <a
                  href={route('user.profile')}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
                >
                  Perfil usuario
                </a>
                <a
                  href={route('user.orders')}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-xl"
                >
                  Órdenes cotización
                </a>
              </div>
            )}
          </div>


              {/* 🚀 Botón Admin */}
              <a
                href={route('admin.dashboard')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all shadow-sm"
                title="Panel de administración"
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </a>
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="px-4 space-y-4">
                <a href={route('home')} className="block font-medium text-gray-900 hover:text-blue-600">
                  Inicio
                </a>

                {/* Dropdown móvil: Nuestra empresa */}
                <div>
                  <button
                    onClick={() => setIsDropdownOpenMobile((s) => !s)}
                    className="flex items-center w-full justify-between font-medium text-gray-900 hover:text-blue-600"
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
                      <a href="#" className="block text-gray-700 hover:text-blue-600">
                        Nuestro equipo
                      </a>
                      <a href="#" className="block text-gray-700 hover:text-blue-600">
                        Sistema de Gestión Integrado
                      </a>
                      <a href="#" className="block text-gray-700 hover:text-blue-600">
                        Contratistas
                      </a>
                    </div>
                  )}
                </div>

                {/* Dropdown móvil: Portafolio */}
                <div>
                  <button
                    onClick={() => setIsServicesDropdownOpenMobile((s) => !s)}
                    className="flex items-center w-full justify-between font-medium text-gray-900 hover:text-blue-600"
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
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        Auditoría
                      </a>
                      <a
                        href={route('services.index', { serviceTypeId: 'formacion' })}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        Formación
                      </a>
                      <a
                        href={route('services.index', { serviceTypeId: 'consultoria' })}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        Consultoría
                      </a>
                    </div>
                  )}
                </div>

                {/* Otros enlaces */}
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600">
                  Actualidad
                </a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600">
                  Clientes
                </a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600">
                  Cursos y Formaciones
                </a>
                <a href="#" className="block font-medium text-gray-900 hover:text-blue-600">
                  Contacto
                </a>

                {/* Botón cotización */}
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

                {/* 🚀 Botón Admin (Móvil) */}
                <a
                  href={route('admin.dashboard')}
                  className="block bg-blue-600 text-white text-center py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Ir al Panel Admin
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal cotización */}
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
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b rounded-tl-2xl bg-white">
      <h3 className="text-xl font-semibold text-gray-900">Lista de Cotización</h3>
      <button
        onClick={() => setShowQuotationModal(false)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
    </div>

    {/* Mensaje de éxito */}
    {successMessage && (
      <div className="mx-6 mt-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow-md">
        {successMessage}
      </div>
    )}

    {/* Contenido principal */}
    <div className="p-6 overflow-y-auto h-[calc(100%-120px)] bg-gray-50">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : quotationData.length > 0 ? (
        <ul className="space-y-4">
          {quotationData.map((item) => {
            const isExpanded = expandedItemId === item.id; // item expandido o no
            return (
              <li
                key={item.id}
                className="relative p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              >
                {/* Encabezado (preview) */}
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className={`flex justify-between items-center ${
                    isExpanded ? 'mb-3' : ''
                  }`}
                >
                  <h4 className="text-lg font-bold text-blue-600 uppercase tracking-wide">
                    {item.service_type || `Cotización #${item.id}`}
                  </h4>
                  <span
                    className={`transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {/* Vista expandida */}
                {isExpanded && (
                  <div className="mt-2 space-y-4 animate-fade-in">
                    {/* Botón eliminar (más abajo, con margen y separado del borde) */}
                    <div className="flex justify-end mt-1 mb-2 pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(item.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Eliminar servicio"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    {/*Linea de gestión*/}
                    <div>
                      <strong>Linea de gestión:</strong>
                      <ul className="list-disc list-inside ml-4">
                          <li>{item.gestion_line}</li>
                      </ul>
                    </div>

                    {/* Servicios */}
                    <div>
                      <strong>Servicios:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {item.services?.map((service) => (
                          <li key={service.id}>{service.name}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Opciones */}
                    <div>
                      <strong>Opciones:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {item.options &&
                          Object.entries(item.options).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong>{' '}
                              {Array.isArray(value)
                                ? value.join(', ')
                                : typeof value === 'object' && value !== null
                                ? JSON.stringify(value)
                                : value}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
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
