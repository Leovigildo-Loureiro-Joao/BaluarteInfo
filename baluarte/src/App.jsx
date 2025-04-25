import { useState } from 'react'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { ModalContent } from './components/Dialog/modal_content'


function App() {

    const [modal,setModal]=useState(null)

  return (
    <>
      <ModalContent modal={modal}/>
      <Header/>
      <Outlet context={{modal:modal,setModal:setModal}}/>
      <Footer/>
    </>
  )
}

export default App
