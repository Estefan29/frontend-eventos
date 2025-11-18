import { Calendar, Home, Users, UserCheck, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ vista, setVista, showSidebar }) => {
  const { usuario, logout } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Dashboard', vista: 'dashboard' },
    { icon: Calendar, label: 'Eventos', vista: 'eventos' },
    { icon: Users, label: 'Usuarios', vista: 'usuarios' },
    { icon: UserCheck, label: 'Inscripciones', vista: 'inscripciones' },
    { icon: CreditCard, label: 'Pagos', vista: 'pagos' },
    { icon: Settings, label: 'Configuración', vista: 'configuracion' },
  ];

  if (!showSidebar) return null;

  return (
    <div style={{
      width: '256px',
      background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)',
      color: 'white',
      padding: '24px',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '12px' }}>
          <Calendar size={32} color="#1e40af" />
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>USC Eventos</h2>
          <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: 0 }}>Admin Panel</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{ marginBottom: '100px' }}>
        {menuItems.map(item => (
          <button
            key={item.vista}
            onClick={() => setVista(item.vista)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: vista === item.vista ? 'white' : 'transparent',
              color: vista === item.vista ? '#1e40af' : 'white',
              cursor: 'pointer',
              fontWeight: '500',
              marginBottom: '8px',
              transition: 'all 0.2s',
              fontSize: '0.95rem'
            }}
            onMouseOver={(e) => {
              if (vista !== item.vista) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseOut={(e) => {
              if (vista !== item.vista) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        right: '24px'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 64, 175, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          border: '1px solid rgba(147, 197, 253, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {usuario?.nombre?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: 0 }}>
                {usuario?.rol || 'user'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#ef4444',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;