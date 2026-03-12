import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/HeaderAdmin';
import Sidebar from '../components/layout/SideBar';
import { Outlet } from 'react-router-dom';


const AUTH_BODY_OVERRIDES = {
  paddingTop: "0",
  minHeight: "100vh",
  fontFamily: "Roboto, system-ui, sans-serif",
};


const AdminLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const openMobileMenu = useCallback(() => setIsMobileSidebarOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileSidebarOpen(false), []);
  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

// src/components/layout/Layout.jsx - MANTENHA ESTE
useEffect(() => {
  const root = document.documentElement;
    
  if (isDarkMode) {
    root.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
  }, [isDarkMode]);

   useEffect(() => {
      const body = document.body;
      const previousStyles = {
        paddingTop: body.style.paddingTop,
        minHeight: body.style.minHeight,
        fontFamily: body.style.fontFamily,
      };
  
      Object.assign(body.style, AUTH_BODY_OVERRIDES);
  
      return () => {
        Object.assign(body.style, previousStyles);
      };
    }, []);

  const sidebarWidth = isSidebarCollapsed ? '5rem' : '18rem';

  return (
    <div className="flex h-screen w-full overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      <Sidebar
        mobileMenuOpen={isMobileSidebarOpen}
        onCloseMobileMenu={closeMobileMenu}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div
        className="flex-1 flex flex-col overflow-hidden lg:pl-[var(--sidebar-width)]"
        style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
      >
        <Header
          setIsDarkMode={setIsDarkMode}
          isDarkMode={isDarkMode}
          onOpenMobileMenu={openMobileMenu}
        />
        <main className="flex-1 overflow-auto p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
