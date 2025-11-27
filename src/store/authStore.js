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
        console.log('🔐 Login en store:', { usuario, token: token ? '***' : null });
        
        // Guardar en localStorage también para compatibilidad
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        set({
          usuario,
          token,
          isAuthenticated: true,
        });
        
        console.log('✅ Estado actualizado:', get());
      },

      // === LOGOUT ===
      logout: () => {
        console.log('👋 Cerrando sesión...');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // Limpiar estado
        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
        });

        // Redirigir al login
        window.location.href = '/login';
      },

      // === ACTUALIZAR PERFIL ===
      actualizarUsuario: (usuarioActualizado) => {
        console.log('📝 Actualizando usuario:', usuarioActualizado);
        
        // Actualizar en localStorage también
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        
        set({
          usuario: usuarioActualizado,
        });
      },

      // === VALIDAR ROL DE ADMIN ===
      esAdmin: () => {
        const usuario = get().usuario;
        return usuario?.rol === 'admin';
      },

      // === VALIDAR SI ES ADMINISTRATIVO ===
      esAdministrativo: () => {
        const usuario = get().usuario;
        return usuario?.rol === 'administrativo';
      },

      // === OBTENER TOKEN ===
      getToken: () => {
        return get().token;
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