// src/components/layout/Header.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiMenu, FiX } from "react-icons/fi";
import { icone, perfil } from "../../assets/Assets";
import Navbar from "./NavBar";
import { getAuthToken, getStoredUser } from "../../utils/auth.js";

type HeaderProps = {
  onOpenMensagens?: () => void;
};

const navItems = [
  { path: "/", label: "Início" },
  { path: "/artigos", label: "Artigos" },
  { path: "/actividades", label: "Actividades" },
  { path: "/midia", label: "Mídia" },
  { path: "/salvacao", label: "Salvação Hoje!" },
  { path: "/contacto", label: "Contacto" },
];

export const Header = ({ onOpenMensagens }: HeaderProps) => {
  const location = useLocation();
  const storedUser = getStoredUser();
  const isAuthenticated = Boolean(getAuthToken() || storedUser);
  const profileImage = storedUser?.img || perfil;
  const profileLink = storedUser?.id ? `/Perfil/${storedUser.id}` : "/Perfil/1";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = useMemo(() => {
    const pathname = location.pathname;
    return (path: string) => pathname === path;
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

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
              className="transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12"
              alt="Ícone da Igreja Baluarte" 
            />
            <div className="flex flex-col">
              <span className="tracking-wider transition-colors duration-300 text-white/80 text-xs md:text-sm">
                Igreja
              </span>
              <h1 className="font-bold leading-tight transition-colors duration-300 text-white text-2xl sm:text-3xl md:text-4xl">
                Baluarte
              </h1>
            </div>
          </Link>

          {/* Navegação - Centralizada */}
          <div className="hidden md:flex flex-1 justify-center">
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

            {isAuthenticated && (
              <>
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
                  to={profileLink} 
                  className="block transition-transform hover:scale-105 ring-2 ring-white/50 rounded-full"
                >
                  <img 
                    src={profileImage} 
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Perfil" 
                  />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden rounded-xl border border-white/20 p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Abrir menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-gray-900 border-l border-gray-800 shadow-2xl overflow-y-auto text-sm"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img src={icone} className="w-10 h-10" alt="Ícone da Igreja Baluarte" />
                    <div className="flex flex-col">
                      <span className="text-white/80 text-xs tracking-wider">Igreja</span>
                      <span className="text-white font-bold leading-tight text-xl">Baluarte</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-white/10 p-2 text-white hover:bg-white/10"
                    aria-label="Fechar menu"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white text-sm font-light">Salmos 23:1</div>
                  <div className="text-white/80 text-xs mt-1">
                    "O Senhor é o meu pastor..."
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                    <Link
                      to={profileLink}
                      className="shrink-0 ring-2 ring-white/30 rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img src={profileImage} className="w-10 h-10 rounded-full object-cover" alt="Perfil" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-semibold truncate">{storedUser?.nome || "Minha conta"}</div>
                      <div className="text-white/70 text-xs truncate">{storedUser?.email || ""}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenMensagens?.();
                      }}
                      className="rounded-xl border border-white/10 p-2 text-white hover:bg-white/10"
                      aria-label="Abrir minhas mensagens"
                    >
                      <FiMail className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <nav className="mt-5 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl border transition-colors ${
                        isActive(item.path)
                          ? "bg-white/10 border-white/15 text-white"
                          : "border-transparent text-white/90 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay suave quando não está scrolled - para melhor legibilidade */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/90 to-transparent"
      />
    </header>
  );
};
