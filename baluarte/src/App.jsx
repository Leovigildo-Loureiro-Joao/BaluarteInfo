import { useState } from 'react'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { ModalContent } from './components/Dialog/modal_content'


function App() {
  return (
    <>
      <ModalContent/>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
