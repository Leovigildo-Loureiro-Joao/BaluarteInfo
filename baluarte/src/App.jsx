import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/mainLayout.js'
import AuthLayout from './layouts/authLayout.js'
import { Home } from './pages/Home.js'
import { PerfilPage } from './pages/Perfil/Perfil.js'
import { ActividadesPage } from './pages/Actividade/Actividade.js'
import { ActividadeDetalhe } from './pages/Actividade/ActividadeDetail.js'
import { MidiaPage } from './pages/Midia/Midia.js'
import { MidiaDetalhe } from './components/midia/MidiaDetail.js'
import { ArtigosPage } from './pages/Artigos/Artigos.js'
import { ArtigoDetalhe } from './pages/Artigos/ArtigosDetails.js'
import { ContactoPage } from './pages/Contacto'
import { SalvacaoPage } from './pages/Salvacao/Salvacao.js'
import { SalvacaoEditAdminPage } from './pages/Salvacao/SalvacaoEditAdmin.js'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import { DashboardPage } from './pages/Admin/Dashboard.js'
import AdminLayout from './layouts/adminLayout.js'
import { ArtigosPageAdmin } from './pages/Artigos/ArtigosAdmin.js'
import { VideosPage } from './pages/Videos/Videos.js'
import { AudiosPage } from './pages/Audios/Audios.js'
import { GaleriaPage } from './pages/Galeria/Galeria.js'
import { ActividadesPageAdmin } from './pages/Actividade/ActividadeAdmin.js'
import { ActividadeDetails } from './pages/Actividade/ActividadeDetailAdmin.js'
import { MensagensPage } from './pages/Mensagem/MensagemAdmin.js'
import { UsuariosPage } from './pages/Usuarios/Usuarios.js'
import { ComentariosPage } from './pages/Comentarios/Comentarios.js'
import { InscricoesPage } from './pages/Inscricao/Inscricao.js'
import { ConfiguracoesPage } from './pages/Configuracoes/Configuracoes.js'
import { AjudaPage } from './pages/Admin/Ajuda.js'
import { AuditLogsPage } from './pages/Admin/AuditLogs.js'
import { NotificacoesPage } from './pages/Admin/Notificacoes.js'
import RequireAdmin from './components/auth/RequireAdmin.jsx'
import { SobrePage } from './pages/Sobre/Sobre.js'
import { ConteudoSobrePage } from './pages/Sobre/SobreEditAdmin.js'
import { PerfilAdminPage } from './pages/Perfil/PerfilAdmin.js'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="perfil/:userID" element={<PerfilPage />} />
          <Route path="actividades" element={<ActividadesPage />} />
          <Route path="sobre" element={<SobrePage />} />
          <Route path="actividades/:id" element={<ActividadeDetalhe />} />
          <Route path="midia" element={<MidiaPage />} />
          <Route path="midia/:id" element={<MidiaDetalhe />} />
          <Route path="artigos" element={<ArtigosPage />} />
          <Route path="artigos/:id" element={<ArtigoDetalhe />} />
          <Route path="salvacao" element={<SalvacaoPage />} />
          <Route path="contacto" element={<ContactoPage />} />
          
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="artigos" element={<ArtigosPageAdmin />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="audios" element={<AudiosPage />} />
          <Route path="sobre" element={<ConteudoSobrePage />} />
          <Route path="salvacao" element={<SalvacaoEditAdminPage />} />
          <Route path="galeria" element={<GaleriaPage />} />
          <Route path="mensagens" element={<MensagensPage />} />
          <Route path="actividades" element={<ActividadesPageAdmin />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="comentarios" element={<ComentariosPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="notificacoes" element={<NotificacoesPage />} />
          <Route path="inscricoes" element={<InscricoesPage />} />
          <Route path="actividades/:id" element={<ActividadeDetails />} />
          <Route path="perfil/:userID" element={<PerfilPage />} />
          <Route path="profile" element={<PerfilAdminPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
