
import ReactDOM from 'react-dom/client';
import App from './layouts/mainLayout.jsx'
import { createBrowserRouter, RouterProvider,Link} from 'react-router-dom'
import { Home } from './pages/Home.tsx'
import { ActividadesPage } from './pages/Actividade/Actividade.tsx'
import React from 'react';
import { PerfilPage as Perfil } from './pages/Perfil.tsx';
import {ArtigosPage as Artigo   } from './pages/Artigos/Artigos.js'; 
import './style/index.css'
import AuthLayout from './layouts/authLayout.jsx';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import { ArtigoDetalhe } from './pages/Artigos/ArtigosDetails.js';
import { MidiaPage } from './pages/Midia/Midia.js';
import { MidiaDetalhe } from './components/midia/MidiaDetail.js';
import { ActividadeDetalhe } from './pages/Actividade/ActividadeDetail.js';
import { SalvacaoPage } from './pages/Salvacao/Salvacao.js';
import { ContactoPage } from './pages/Contacto.js';

const router=createBrowserRouter([{
  path: "/",
  element: <App/>,
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
      element: <Perfil/>
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
      element: <Artigo/>
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
,
  {
    path: "/auth",
    element: <AuthLayout />,
    
    children: [
      {path: "/auth", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  }])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
