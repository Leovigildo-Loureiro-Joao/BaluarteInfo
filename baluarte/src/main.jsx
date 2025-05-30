
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider,Link} from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { Actividade } from './pages/Actividade.jsx'
import React from 'react';
import "./style/index.css"
import "./style/all.min.css"
import { Destaque } from './pages/Destaque.jsx';
import { Perfil } from './pages/Perfil.jsx';
import { QuemSomos } from './pages/QuemSomos.jsx';
import { Salvacao } from './pages/Salvacao.jsx';
import { Artigo } from './pages/Artigos.jsx';
import { Audios } from './pages/Audios.jsx';
import { ActiviComplete } from './components/cards/Actividade/activeComplete.jsx';
import { Videos } from './pages/Videos.jsx';
import AuthLayout from './layouts/authLayout.jsx';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

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
      path: "/Actividade/:id",
      element: <Actividade/>
    },
    {
      path: "/Perfil/:userID",
      element: <Perfil/>
    },
    {
      path: "/Actividade",
      element: <Actividade/>
    },
    {
      path: "/Destaque",
      element: <Destaque/>
    },
    ,
    {
      path: "/Destaque/:seccao",
      element: <Destaque/>
    },
    {
      path: "/Audios",
      element: <Audios/>
    }, 
    {
      path: "/Videos",
      element: <Videos/>
    }, 
    {
      path: "/Artigos",
      element: <Artigo/>
    },
    {
      path: "/QuemSomos",
      element: <QuemSomos/>
    },
    {
      path: "/Salvacao",
      element: <Salvacao/>
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
