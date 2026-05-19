import { create } from 'zustand'
import * as authService from '../services/authService'
export const useAuthStore = create((set) => ({
  user: null, isLoading: false, isRestoring: true,
  restoreSession: async () => { const t = localStorage.getItem('solidarizabs_token'); if (!t) { set({ isRestoring: false }); return }; try { const user = await authService.getMe(); set({ user, isRestoring: false }) } catch { localStorage.removeItem('solidarizabs_token'); set({ user: null, isRestoring: false }) } },
  login: async (email, senha) => { set({ isLoading: true }); try { const user = await authService.login(email, senha); set({ user, isLoading: false }); return { success: true } } catch (e) { set({ isLoading: false }); return { success: false, error: e.message } } },
  register: async (data, tipo) => { set({ isLoading: true }); try { const user = await authService.register(data, tipo); set({ user, isLoading: false }); return { success: true, user } } catch (e) { set({ isLoading: false }); return { success: false, error: e.message } } },
  logout: () => { authService.logout(); set({ user: null }) },
}))
