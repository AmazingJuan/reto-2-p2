import React from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { route } from 'ziggy-js';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="space-y-6">
            <img
              src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/Logo_white.png"
              alt="Training Corporation Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Contacts*/}
          <div>
            <h3 className="text-lg font-bold mb-6">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Carrera 43A No 1 A - Sur 29 Edificio Colmena, oficina 315.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a className="text-gray-300 hover:text-white transition-colors">
                  57 (604) 3223182
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a className="text-gray-300 hover:text-white transition-colors">
                  gerencia@trainingcorporation.com.co
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="https://www.trainingcorporation.com.co/" className="text-gray-300 hover:text-white transition-colors">
                  trainingcorporation.com.co
                </a>
              </div>
            </div>
          </div>

          {/* Currently */}
          <div>
            <h3 className="text-lg font-bold mb-6">Actualidad</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm leading-relaxed">
                  Participación en el Programa Progresa – CORNARE.
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm leading-relaxed">
                  Camino hacia la sostenibilidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm leading-relaxed">
                  Nueva sede administrativa
                </a>
              </li>
            </ul>
          </div>

          {/* Agreements */}
          <div>
            <h3 className="text-lg font-bold mb-6">Convenios</h3>
            <img
              src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/convenios.png"
              alt="Convenios"
              className="w-full max-w-xs"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Enlaces principales</h4>
              <ul className="space-y-2 text-sm">
                <li><a href={ route('home') } className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors">Nuestra empresa</a></li>
                <li><a href={ route('portfolio.index') } className="text-gray-300 hover:text-white transition-colors">Portafolio de servicios</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors">Actualidad</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors">Clientes</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors">Cursos y Formaciones</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
        </div>


        {/* Bottom part of the footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            Training Corporation - 2025
          </div>
          <div className="flex space-x-4">
            <a target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebook size={20} />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;