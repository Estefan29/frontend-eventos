import React, { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, TrendingUp, Plus, Edit2, Trash2, Eye, Search, Filter, LogOut, Home, Settings, Bell, Menu, X, Clock, MapPin, DollarSign, UserCheck, AlertCircle } from 'lucide-react';

// Simulación de Store (reemplazar con Zustand en producción)
const useAuthStore = () => {
  const [state, setState] = useState({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  const login = (usuario, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setState({ usuario, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.clear();
    setState({ usuario: null, isAuthenticated: false });
  };

  return { ...state, login, logout };
};

function App() {
  const [vista, setVista] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(true);
  const [modalEvento, setModalEvento] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const { usuario, isAuthenticated, login, logout } = useAuthStore();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  // Login Component
  const LoginPage = () => {
    const [formData, setFormData] = useState({ correo: '', contraseña: '' });
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      setLoading(true);
      setTimeout(() => {
        login({
          id: '1',
          nombre: isRegister ? formData.nombre : 'Admin USC',
          correo: formData.correo,
          rol: 'admin'
        }, 'fake-token-123');
        setShowLogin(false);
        setLoading(false);
      }, 1000);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-all hover:scale-[1.02] duration-300">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              Eventos USC
            </h1>
            <p className="text-gray-500">
              {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
            </p>
          </div>

          <div className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Nombre completo"
                className="input-field"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            )}
            
            <input
              type="email"
              placeholder="Correo institucional"
              className="input-field"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
            />
            
            <input
              type="password"
              placeholder="Contraseña"
              className="input-field"
              value={formData.contraseña}
              onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
            />

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-primary justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isRegister ? 'Registrarse' : 'Iniciar Sesión'
              )}
            </button>

            <p className="text-center text-gray-600 text-sm">
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const stats = [
      { icon: Calendar, label: 'Eventos Activos', value: '24', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', change: '+12%', trend: 'up' },
      { icon: Users, label: 'Usuarios Registrados', value: '1,247', color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-100', textColor: 'text-blue-700', change: '+8%', trend: 'up' },
      { icon: UserCheck, label: 'Inscripciones', value: '856', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-500', change: '+23%', trend: 'up' },
      { icon: DollarSign, label: 'Ingresos Totales', value: '$45,890', color: 'from-blue-700 to-blue-800', bgColor: 'bg-blue-100', textColor: 'text-blue-800', change: '+15%', trend: 'up' },
    ];

    const eventosProximos = [
      { id: 1, titulo: 'Hackathon USC 2024', fecha: '25 Dic', inscritos: 45, color: 'bg-blue-500' },
      { id: 2, titulo: 'Conferencia IA', fecha: '28 Dic', inscritos: 78, color: 'bg-blue-600' },
      { id: 3, titulo: 'Workshop React', fecha: '30 Dic', inscritos: 30, color: 'bg-blue-700' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-2">Bienvenido de nuevo, {usuario?.nombre} 👋</p>
          </div>
          <button className="btn-primary">
            <Plus className="w-5 h-5" />
            Nuevo Evento
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="card p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                  <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                </div>
                <span className="text-green-500 text-sm font-semibold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Eventos Próximos */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Eventos Próximos</h2>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ver todos →
              </button>
            </div>
            <div className="space-y-4">
              {eventosProximos.map((evento) => (
                <div key={evento.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className={`${evento.color} w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    {evento.fecha.split(' ')[0]}
                    <span className="text-xs ml-1">{evento.fecha.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{evento.titulo}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {evento.inscritos} inscritos
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
            <div className="space-y-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl hover:bg-blue-100 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Nueva inscripción</p>
                    <p className="text-xs text-gray-500 mt-0.5">Hace {i} hora{i > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Eventos View
  const EventosView = () => {
    const [busqueda, setBusqueda] = useState('');
    
    const eventos = [
      { id: 1, titulo: 'Hackathon USC 2024', fecha: '2024-12-20', lugar: 'Auditorio Principal', inscritos: 45, capacidad: 100, precio: 15000, estado: 'activo' },
      { id: 2, titulo: 'Conferencia IA', fecha: '2024-12-25', lugar: 'Sala 401', inscritos: 78, capacidad: 80, precio: 0, estado: 'activo' },
      { id: 3, titulo: 'Workshop React', fecha: '2024-12-30', lugar: 'Lab Sistemas', inscritos: 30, capacidad: 40, precio: 25000, estado: 'activo' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Gestión de Eventos</h1>
            <p className="text-gray-500 mt-2">Administra todos los eventos de la universidad</p>
          </div>
          <button onClick={() => setModalEvento(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Crear Evento
          </button>
        </div>

        <div className="card p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="input-field pl-12"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button className="btn-secondary">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-4 px-4 font-bold text-gray-700">Evento</th>
                  <th className="py-4 px-4 font-bold text-gray-700">Fecha</th>
                  <th className="py-4 px-4 font-bold text-gray-700">Lugar</th>
                  <th className="py-4 px-4 font-bold text-gray-700">Capacidad</th>
                  <th className="py-4 px-4 font-bold text-gray-700">Precio</th>
                  <th className="py-4 px-4 font-bold text-gray-700">Estado</th>
                  <th className="py-4 px-4 font-bold text-gray-700 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md">
                          {evento.titulo.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800">{evento.titulo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(evento.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {evento.lugar}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{evento.inscritos}/{evento.capacidad}</span>
                          <span className="text-xs text-gray-500">{Math.round((evento.inscritos/evento.capacidad)*100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-300"
                            style={{width: `${(evento.inscritos/evento.capacidad)*100}%`}}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-blue-600">
                        {evento.precio === 0 ? 'Gratis' : `$${evento.precio.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Activo
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2 justify-end">
                        <button className="p-2.5 hover:bg-blue-100 rounded-xl transition-colors group">
                          <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2.5 hover:bg-blue-100 rounded-xl transition-colors group">
                          <Edit2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2.5 hover:bg-red-100 rounded-xl transition-colors group">
                          <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar
  const Sidebar = () => {
    const menuItems = [
      { icon: Home, label: 'Dashboard', vista: 'dashboard' },
      { icon: Calendar, label: 'Eventos', vista: 'eventos' },
      { icon: Users, label: 'Usuarios', vista: 'usuarios' },
      { icon: UserCheck, label: 'Inscripciones', vista: 'inscripciones' },
      { icon: CreditCard, label: 'Pagos', vista: 'pagos' },
      { icon: Settings, label: 'Configuración', vista: 'config' },
    ];

    return (
      <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white transition-all duration-300 z-50 ${showSidebar ? 'w-64' : 'w-0 -translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <Calendar className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h2 className="font-bold text-xl">USC Eventos</h2>
              <p className="text-xs text-blue-200">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.vista}
                onClick={() => setVista(item.vista)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                  vista === item.vista 
                    ? 'bg-white text-blue-900 shadow-xl scale-105' 
                    : 'hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-800 rounded-xl p-4 mb-4 border border-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold text-lg shadow-lg">
                  {usuario?.nombre?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{usuario?.nombre}</p>
                  <p className="text-xs text-blue-200">{usuario?.rol}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {vista === 'dashboard' && <Dashboard />}
          {vista === 'eventos' && <EventosView />}
          {vista === 'usuarios' && <div className="text-center py-20 card p-10"><AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800">Vista de Usuarios</h2><p className="text-gray-500 mt-2">En desarrollo</p></div>}
          {vista === 'inscripciones' && <div className="text-center py-20 card p-10"><AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800">Vista de Inscripciones</h2><p className="text-gray-500 mt-2">En desarrollo</p></div>}
          {vista === 'pagos' && <div className="text-center py-20 card p-10"><AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800">Vista de Pagos</h2><p className="text-gray-500 mt-2">En desarrollo</p></div>}
        </div>
      </div>
    </div>
  );
}

export default App;