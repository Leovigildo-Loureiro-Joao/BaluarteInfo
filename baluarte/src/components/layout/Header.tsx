// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { icone, perfil } from "../../assets/Assets";
import Navbar from "./NavBar";

type HeaderProps = {
  onOpenMensagens?: () => void;
};

export const Header = ({ onOpenMensagens }: HeaderProps) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 py-4 shadow-lg shadow-black/30"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo e Nome da Igreja */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={icone} 
              className="transition-all duration-300 w-12 h-12"
              alt="Ícone da Igreja Baluarte" 
            />
            <div className="flex flex-col">
              <span className="tracking-wider transition-colors duration-300 text-white/80 text-xs md:text-sm">
                Igreja
              </span>
              <h1 className="font-bold leading-tight transition-colors duration-300 text-white text-3xl md:text-4xl">
                Baluarte
              </h1>
            </div>
          </Link>

          {/* Navegação - Centralizada */}
          <div className="flex-1 flex justify-center">
            <Navbar />
          </div>

          {/* Perfil, mensagens e versículo */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <h2 className="text-white text-lg font-light">Salmos 23:1</h2>
              <p className="text-white/80 text-sm md:text-base max-w-[220px]">
                "O Senhor é o meu pastor..."
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenMensagens?.()}
              className="group rounded-full border border-white/20 p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Abrir minhas mensagens"
            >
              <FiMail className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Perfil */}
            <Link 
              to="/Perfil/1" 
              className="block transition-transform hover:scale-105 ring-2 ring-white/50 rounded-full"
            >
              <img 
                src={perfil} 
                className="w-10 h-10 rounded-full object-cover"
                alt="Perfil" 
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay suave quando não está scrolled - para melhor legibilidade */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/90 to-transparent"
      />
    </header>
  );
};
