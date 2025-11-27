import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';
import Usuarios from './pages/Usuarios';
import Inscripciones from './pages/Inscripciones';
import Pagos from './pages/Pagos';
import MisInscripciones from './pages/MisInscripciones';
import RestablecerPassword from './pages/RestablecerPassword'; 
import { Routes, Route } from 'react-router-dom';

function App() {
  const [vista, setVista] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(true);
  const { isAuthenticated, usuario } = useAuthStore();

  //  Verificar si el usuario NO está autenticado
  if (!isAuthenticated) {
    return <Login />;
  }

  // Verificar roles y permisos
  const esAdmin = usuario?.rol === 'admin';
  const esAdministrativo = usuario?.rol === 'administrativo';
  const tieneAccesoCompleto = esAdmin || esAdministrativo;
  const esUsuarioRegular = ['estudiante', 'profesor', 'externo'].includes(usuario?.rol);

  const renderPage = () => {
    switch(vista) {
      case 'dashboard': 
        return <Dashboard />;
      
      case 'eventos': 
        //  Todos pueden ver eventos
        return <Eventos />;
      
      case 'mis-inscripciones':
        //  Usuarios regulares ven sus propias inscripciones
        return <MisInscripciones />;
      
      case 'usuarios': 
        //  Solo admin puede gestionar usuarios
        if (tieneAccesoCompleto) {
          return <Usuarios />;
        }
        return <AccessDenied rol={usuario?.rol} seccion="Gestión de Usuarios" />;
      
      case 'inscripciones': 
        // Admin y administrativo pueden ver TODAS las inscripciones
        if (tieneAccesoCompleto) {
          return <Inscripciones />;
        }
        return <AccessDenied rol={usuario?.rol} seccion="Gestión de Inscripciones" />;
      
      case 'pagos': 
        // Solo admin y administrativo pueden gestionar pagos
        if (tieneAccesoCompleto) {
          return <Pagos />;
        }
        return <AccessDenied rol={usuario?.rol} seccion="Gestión de Pagos" />;
      
      default: 
        return <Dashboard />;
    }
  };

  return (
     <Routes>
      {/* Ruta pública para restablecer contraseña */}
      <Route path="/restablecer-password" element={<RestablecerPassword />} />
      
      {/* Rutas de la aplicación */}
      <Route
        path="/*"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui' }}>
              <Sidebar vista={vista} setVista={setVista} showSidebar={showSidebar} />
              
              <div style={{
                marginLeft: showSidebar ? '256px' : '0',
                flex: 1,
                transition: 'margin 0.3s'
              }}>
                <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                
                <div style={{ padding: '32px' }}>
                  {renderPage()}
                </div>
              </div>
            </div>
          )
        }
      />
    </Routes>
  );
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui' }}>
      <Sidebar 
        vista={vista} 
        setVista={setVista} 
        showSidebar={showSidebar}
        esAdmin={esAdmin}
        tieneAccesoCompleto={tieneAccesoCompleto}
        esUsuarioRegular={esUsuarioRegular}
      />
      
      <div style={{
        marginLeft: showSidebar ? '256px' : '0',
        flex: 1,
        transition: 'margin 0.3s'
      }}>
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        
        <div style={{ padding: '32px' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  ;
}

// ✅ Componente para mostrar cuando no hay acceso
function AccessDenied({ rol, seccion }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '12px'
      }}>
        Acceso Denegado
      </h2>
      
      <p style={{
        color: '#6b7280',
        fontSize: '1.125rem',
        marginBottom: '8px'
      }}>
        No tienes permisos para acceder a: <strong>{seccion}</strong>
      </p>
      
      <p style={{
        color: '#9ca3af',
        fontSize: '0.875rem'
      }}>
        Tu rol actual: <span style={{ fontWeight: '600', color: '#374151' }}>
          {rol === 'estudiante' ? 'Estudiante' : 
           rol === 'profesor' ? 'Profesor' :
           rol === 'externo' ? 'Externo' : rol}
        </span>
      </p>

      <div style={{
        marginTop: '24px',
        padding: '16px 24px',
        backgroundColor: '#eff6ff',
        borderRadius: '12px',
        border: '2px solid #bfdbfe'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
          💡 Puedes inscribirte a eventos desde la sección <strong>"Eventos"</strong>
        </p>
      </div>
    </div>
  );
}

export default App;