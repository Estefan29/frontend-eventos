import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,

      login: (usuario, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        set({ usuario, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        set({ usuario: null, token: null, isAuthenticated: false });
      },

      actualizarUsuario: (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        set({ usuario });
      },

      esAdmin: () => {
        const state = useAuthStore.getState();
        return state.usuario?.rol === 'admin';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);