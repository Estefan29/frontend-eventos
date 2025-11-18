// src/App.jsx - Sistema Completo Organizado
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

function App() {
  const [vista, setVista] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(true);
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch(vista) {
      case 'dashboard': return <Dashboard />;
      case 'eventos': return <Eventos />;
      case 'usuarios': return <Usuarios />;
      case 'inscripciones': return <Inscripciones />;
      case 'pagos': return <Pagos />;
      default: return <Dashboard />;
    }
  };

  return (
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
  );
}

export default App;