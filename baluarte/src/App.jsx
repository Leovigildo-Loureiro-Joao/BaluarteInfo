import { useState } from 'react'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { ModalContent } from './components/Dialog/modal_content'
import { ModalProvider } from './components/Dialog/ModalContext'
import { ModalManager } from './components/Dialog/ModalManager'


function App() {

    const [modal,setModal]=useState(null)

  return (
    <>
      <ModalProvider>
          <Header />
          <ModalManager />
          <Outlet context={{modal:modal,setModal:setModal}}/>
          <Footer />
      </ModalProvider>
    </>
  )
}

export default App
