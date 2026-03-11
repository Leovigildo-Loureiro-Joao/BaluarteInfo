import { useState } from 'react'
import { Header } from '../components/layout/Header.js'
import { Footer } from '../components/layout/Footer.jsx'
import { Outlet } from 'react-router-dom'



function App() {

    const [modal,setModal]=useState(null)

  return (
    <>
     
      <Header />
        <Outlet context={{modal:modal,setModal:setModal}}/>
      <Footer />

    </>
  )
}

export default App
