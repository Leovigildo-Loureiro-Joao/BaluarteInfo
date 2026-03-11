// src/components/layout/NavBar.tsx
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Início" },
    { path: "/artigos", label: "Artigos" },
    { path: "/actividades", label: "Actividades" },
    { path: "/midia", label: "Mídia" },
    { path: "/salvacao", label: "Salvação Hoje!" },
    { path: "/contacto", label: "Contacto" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center gap-3">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            px-4 py-2 text-sm md:text-base font-semibold rounded-lg tracking-wide transition-all duration-300
            ${isActive(item.path)
              ? "bg-white/20 text-white backdrop-blur-sm"
              : "text-white/90 hover:bg-white/10"
            }
        `}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
