// src/admin/components/Sidebar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiBook,
  FiSettings, 
  FiChevronDown,
  FiX,
  FiChevronLeft,
  FiUser,
  FiLogOut,
  FiMail,
  FiVideo,
  FiImage,
  FiHeadphones,
  FiFileText,
  FiBarChart2,
  FiMessageCircle,
  FiHelpCircle,
  FiStar
} from 'react-icons/fi';
import { 
  GiCross, 
  GiBible, 
  GiPrayer,
  GiMusicalNotes,
  GiSoundOn,
  GiPhotoCamera,
  GiArchiveRegister
} from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { icone } from '../../assets/Assets';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles?: ('admin' | 'manager' | 'editor')[];
}

interface SidebarProps {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, onCloseMobileMenu, isCollapsed, onToggleCollapse }) => {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showHelpMenu, setShowHelpMenu] = useState<boolean>(false);
  
  // Mock user data (depois virá do contexto)
  const user = {
    email: "admin@igrejabaluarte.com",
    name: "Admin Baluarte",
    role: "admin" as const,
    avatar: null
  };

  // Menu principal
  const mainNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
    { name: 'Artigos', href: '/admin/artigos', icon: FiFileText, badge: 3 },
    { name: 'Vídeos', href: '/admin/videos', icon: FiVideo, badge: 2 },
    { name: 'Áudios', href: '/admin/audios', icon: FiHeadphones },
    { name: 'Galeria', href: '/admin/galeria', icon: FiImage },
    { name: 'Actividades', href: '/admin/actividades', icon: FiCalendar },
    { name: 'Mensagens', href: '/admin/mensagens', icon: FiMail, badge: 5 },
  ];

  const managementNavigation: NavigationItem[] = [
    { name: 'Usuários', href: '/admin/usuarios', icon: FiUsers, roles: ['admin'] },
    { name: 'Comentários', href: '/admin/comentarios', icon: FiMessageCircle, badge: 12 },
    { name: 'Inscrições', href: '/admin/inscricoes', icon: GiArchiveRegister },
  ];

  const configNavigation: NavigationItem[] = [
    { name: 'Configurações', href: '/admin/configuracoes', icon: FiSettings },
    { name: 'Ajuda', href: '/admin/ajuda', icon: FiHelpCircle },
  ];

  // Animações
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const menuItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  // Responsividade
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      setIsMobile(mobile);
      
      if (width >= 1024) {
        onCloseMobileMenu();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCloseMobileMenu]);

  // Fechar menus ao mudar de rota
  useEffect(() => {
    setShowUserMenu(false);
    setShowHelpMenu(false);
    if (isMobile) {
      onCloseMobileMenu();
    }
  }, [location.pathname, isMobile, onCloseMobileMenu]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const getUserInitial = () => {
    return user.name?.charAt(0).toUpperCase() || 'A';
  };

  const isDesktopCollapsed = !isMobile && isCollapsed;
  const shouldShowSidebar = isMobile ? mobileMenuOpen : true;

  // Filtrar itens por role
  const filterByRole = (items: NavigationItem[]) => {
    return items.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(user.role);
    });
  };

  return (
    <>
      {/* Overlay Mobile */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobileMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={shouldShowSidebar ? "open" : "closed"}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 text-gray-900 shadow-2xl overflow-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 ${
          isDesktopCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header com Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!isDesktopCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <img src={icone} alt="Baluarte" className="w-10 h-10" />
                  
                </div>
                <div>
                  <h1 className="text-lg font-bold text-primary dark:text-white">Admin</h1>
                  <p className="text-xs text-gray-400">Igreja Baluarte</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {/* Botão Collapse/Expand */}
            <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
              <FiChevronLeft 
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDesktopCollapsed ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Botão Fechar Mobile */}
            <button
              onClick={onCloseMobileMenu}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent px-3 py-6">
          {/* Menu Principal */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {!isDesktopCollapsed ? 'Principal' : '···'}
            </p>
            {filterByRole(mainNavigation).map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && onCloseMobileMenu()}
              >
                {({ isActive }) => (
                  <motion.div
                    variants={menuItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                    className={`relative flex items-center px-3 py-2.5 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isDesktopCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    
                    {!isDesktopCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Tooltip quando collapsed */}
                    {isDesktopCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-white text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-200 shadow-lg">
                        {item.name}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Gestão */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {!isDesktopCollapsed ? 'Gestão' : '···'}
            </p>
            {filterByRole(managementNavigation).map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && onCloseMobileMenu()}
              >
                {({ isActive }) => (
                  <motion.div
                    variants={menuItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: (mainNavigation.length + index) * 0.05 }}
                    className={`relative flex items-center px-3 py-2.5 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isDesktopCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    
                    {!isDesktopCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {isDesktopCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-white text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-200 shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Configurações */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {!isDesktopCollapsed ? 'Sistema' : '···'}
            </p>
            {filterByRole(configNavigation).map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && onCloseMobileMenu()}
              >
                {({ isActive }) => (
                  <motion.div
                    variants={menuItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: (mainNavigation.length + managementNavigation.length + index) * 0.05 }}
                    className={`relative flex items-center px-3 py-2.5 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isDesktopCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    
                    {!isDesktopCollapsed && (
                      <span className="flex-1 text-sm font-medium">{item.name}</span>
                    )}

                    {isDesktopCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-white text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-200 shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer com User */}
        <div className={`mt-auto p-4 border-t border-gray-200 dark:border-gray-700 ${isDesktopCollapsed ? 'text-center' : ''}`}>
          {!isDesktopCollapsed ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {getUserInitial()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.role === 'admin' ? 'Administrador' : 'Editor'}
                  </p>
                </div>
                
                <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
              <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-1">
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/admin/perfil/1');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Meu Perfil</span>
                      </button>
                      
                      <hr className="my-1 border-gray-100" />

                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative mx-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getUserInitial()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
