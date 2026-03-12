
import ReactDOM from 'react-dom/client';
import mainLayout from './App.jsx'
import { createBrowserRouter, RouterProvider,Link} from 'react-router-dom'
import { Home } from './pages/Home.js'
import { ActividadesPage } from './pages/Actividade/Actividade.js'
import React from 'react';
import { PerfilPage as Perfil } from './pages/Perfil/Perfil.js';
import {ArtigosPage as Artigo   } from './pages/Artigos/Artigos.js'; 
import './style/index.css'
import AuthLayout from './layouts/authLayout.js';

import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import { ArtigoDetalhe } from './pages/Artigos/ArtigosDetails.js';
import { MidiaPage } from './pages/Midia/Midia.js';
import { MidiaDetalhe } from './components/midia/MidiaDetail.js';
import { ActividadeDetalhe } from './pages/Actividade/ActividadeDetail.js';
import { SalvacaoPage } from './pages/Salvacao/Salvacao.js';
import { ContactoPage } from './pages/Contacto.js';
import App from './App.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <App/>
  </React.StrictMode>,
)
