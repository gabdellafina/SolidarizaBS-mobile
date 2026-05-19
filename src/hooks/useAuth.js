import { useAuthStore } from '../store/authStore'
import { USER_TIPOS } from '../utils/constants'
export const useAuth = () => { const s = useAuthStore(); return { ...s, isLogged: !!s.user, isAdmin: s.user?.tipo === USER_TIPOS.ADMIN, isOng: s.user?.tipo === USER_TIPOS.ONG, isDoador: s.user?.tipo === USER_TIPOS.DOADOR } }
