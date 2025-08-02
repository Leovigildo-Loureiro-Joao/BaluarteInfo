import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalManager from "../components/ModalManager";

export default function MainLayout() {
  return (
    <ModalProvider>
      <Header />
      <ModalManager />
      <Outlet />
      <Footer />
    </ModalProvider>
  );
}
