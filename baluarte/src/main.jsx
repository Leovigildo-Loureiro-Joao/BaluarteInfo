
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider,Link} from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { Actividade } from './pages/Actividade.jsx'
import React from 'react';
import "./style/index.css"
import { Destaque } from './pages/Destaque.jsx';
import { Midia } from './pages/Midia.jsx';
import { Perfil } from './pages/Perfil.jsx';
import { MidiaDocs } from './pages/MidiaDocs.jsx';

const router=createBrowserRouter([{
  path: "/",
  element: <App/>,
  children:[
    {
      path: "/",
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
    {
      path: "/Midia",
      element: <Midia/>
    },
    {
      path: "/MidiaDocs",
      element: <MidiaDocs/>
    }
  ]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
