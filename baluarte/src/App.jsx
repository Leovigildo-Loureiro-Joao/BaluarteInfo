import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from './layouts/mainLayout.js'
import AuthLayout from './layouts/authLayout.js'
import { Home } from './pages/Home.js'
import { PerfilPage } from './pages/Perfil.js'
import { ActividadesPage } from './pages/Actividade/Actividade.js'
import { ActividadeDetalhe } from './pages/Actividade/ActividadeDetail.js'
import { MidiaPage } from './pages/Midia/Midia.js'
import { MidiaDetalhe } from './components/midia/MidiaDetail.js'
import { ArtigosPage } from './pages/Artigos/Artigos.js'
import { ArtigoDetalhe } from './pages/Artigos/ArtigosDetails.js'
import { ContactoPage } from './pages/Contacto.js'
import { SalvacaoPage } from './pages/Salvacao/Salvacao.js'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import { DashboardPage } from './pages/Admin/Dashboard.js'
import AdminLayout from './layouts/adminLayout.js'

const router=createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },{
        path: "/Home",
        element: <Home/>
      },
      
      {
        path: "/Perfil/:userID",
        element: <PerfilPage/>
      },
      {
        path: "/Actividades",
        element: <ActividadesPage/>
      },
      {
        path: "/Actividades/:id",
        element: <ActividadeDetalhe/>
      },
      {
        path: "/Midia",
        element: <MidiaPage/>
      }, 
      {
        path: "/Midia/:id",
        element: <MidiaDetalhe/>
      }, 
      {
        path: "/Artigos",
        element: <ArtigosPage/>
      },
      {
        path: "/Artigos/:id",
        element: <ArtigoDetalhe/>
      },
      {
        path: "/salvacao",
        element: <SalvacaoPage/>
      },
      {
        path: "/contacto",
        element: <ContactoPage/>
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    
    children: [
      {path: "/auth", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  },
  {
     path: "/admin",
      element: <AdminLayout  />,
      children: [
      {path: "/admin", element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
    ]
  }
])



function App() {
  return  <RouterProvider router={router}/>;
}

export default App
