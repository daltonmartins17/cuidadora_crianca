import React from "react";
import { Heart, Mail, MapPin, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">👶 Cuidadora</h3>
            <p className="text-gray-400">
              Conectando pais com cuidadores de confiança para suas crianças.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Recursos</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Para Pais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Para Babás
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Termos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <div className="text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@cuidadora.pt</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Portugal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
          <p className="text-gray-400">
            © 2024 Cuidadora. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-gray-400">
            <Zap size={16} />
            <span>Feito com </span>
            <Heart size={16} className="text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
