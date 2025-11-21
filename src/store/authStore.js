import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,

      // === LOGIN ===
      login: (usuario, token) => {
        set({
          usuario,
          token,
          isAuthenticated: true,
        });
      },

      // === LOGOUT ===
      logout: () => {
        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // === ACTUALIZAR PERFIL ===
      actualizarUsuario: (usuarioActualizado) => {
        set({
          usuario: usuarioActualizado,
        });
      },

      // === VALIDAR ROL DE ADMIN ===
      esAdmin: () => {
        const usuario = get().usuario;
        return usuario?.rol === 'admin';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
