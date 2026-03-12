import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { MinhasMensagensDrawer } from "../pages/Mensagem/MinhasMensagens";

export function MainLayout() {
  const [mensagensOpen, setMensagensOpen] = useState(false);
  return (
    <>
     
      <Header onOpenMensagens={() => setMensagensOpen(true)} />
        <Outlet/>
      <Footer />
      <MinhasMensagensDrawer
        open={mensagensOpen}
        onClose={() => setMensagensOpen(false)}
      />

    </>
  )
}
