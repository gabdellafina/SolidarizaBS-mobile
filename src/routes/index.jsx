import { Routes, Route, Navigate } from 'react-router-dom'
import SplashPage from '../pages/SplashPage'
import LoginPage from '../pages/LoginPage'
import CadastroPage from '../pages/CadastroPage'
import HomePage from '../pages/HomePage'
import ProjetosPage from '../pages/ProjetosPage'
import OngDetailPage from '../pages/OngDetailPage'
import DoacaoPage from '../pages/DoacaoPage'
import PerfilPage from '../pages/PerfilPage'
import HistoricoPage from '../pages/HistoricoPage'
import ConfiguracoesPage from '../pages/ConfiguracoesPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Splash */}
      <Route path="/" element={<SplashPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      {/* Main app */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/projetos" element={<ProjetosPage />} />
      <Route path="/ong/:id" element={<OngDetailPage />} />
      <Route path="/doar/:id" element={<DoacaoPage />} />

      {/* Perfil */}
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="/historico" element={<HistoricoPage />} />
      <Route path="/configuracoes" element={<ConfiguracoesPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
