import { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, UserCheck, Clock, MapPin, Ticket, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import { eventosAPI, inscripcionesAPI } from '../services/api';

const Dashboard = () => {
  const { usuario } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Estados para Admin
  const [statsAdmin, setStatsAdmin] = useState({
    eventos: 0,
    usuarios: 0,
    inscripciones: 0,
    ingresos: 0
  });

  // Estados para Usuario Normal
  const [statsUsuario, setStatsUsuario] = useState({
    misInscripciones: 0,
    eventosDisponibles: 0,
    proximosEventos: 0
  });

  const [eventosProximos, setEventosProximos] = useState([]);
  const [misInscripcionesRecientes, setMisInscripcionesRecientes] = useState([]);

  const esAdministrativo = usuario?.rol === 'administrativo';

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      if (esAdministrativo) {
        await cargarDatosAdmin();
      } else {
        await cargarDatosUsuario();
      }

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 👨‍💼 DASHBOARD DE ADMINISTRADOR
  // ========================================
  const cargarDatosAdmin = async () => {
    try {
      // Importar las APIs necesarias
      const { usuariosAPI, pagosAPI } = await import('../services/api');

      // Cargar todos los datos en paralelo
      const [eventosRes, usuariosRes, inscripcionesRes, pagosRes] = await Promise.all([
        eventosAPI.obtenerTodos().catch(() => ({ data: { data: { eventos: [] } } })),
        usuariosAPI.obtenerTodos().catch(() => ({ data: { data: { usuarios: [] } } })),
        inscripcionesAPI.obtenerTodas().catch(() => ({ data: { data: { inscripciones: [] } } })),
        pagosAPI.obtenerTodos().catch(() => ({ data: [] }))
      ]);

      // Extraer datos
      const eventos = eventosRes.data?.data?.eventos || eventosRes.data || [];
      const usuarios = usuariosRes.data?.data?.usuarios || usuariosRes.data || [];
      const inscripciones = inscripcionesRes.data?.data?.inscripciones || inscripcionesRes.data || [];
      const pagos = pagosRes.data || [];

      console.log('📊 Datos Admin:', { eventos: eventos.length, usuarios: usuarios.length, inscripciones: inscripciones.length, pagos: pagos.length });

      // Calcular ingresos totales de pagos completados
      const ingresosTotal = pagos
        .filter(p => p.estado === 'completado')
        .reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);

      setStatsAdmin({
        eventos: eventos.length,
        usuarios: usuarios.length,
        inscripciones: inscripciones.length,
        ingresos: Math.round(ingresosTotal)
      });

      // Eventos próximos (admin ve todos)
      const ahora = new Date();
      const eventosOrdenados = eventos
        .filter(e => {
          if (!e.fecha) return false;
          const fechaEvento = new Date(e.fecha);
          return fechaEvento >= ahora;
        })
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 4)
        .map(evento => ({
          id: evento._id,
          titulo: evento.titulo,
          fecha: formatearFechaCorta(evento.fecha),
          inscritos: evento.inscritos || 0,
          lugar: evento.lugar,
          color: obtenerColorAleatorio()
        }));

      setEventosProximos(eventosOrdenados);

    } catch (error) {
      console.error('Error al cargar datos de admin:', error);
    }
  };

  // ========================================
  // 👤 DASHBOARD DE USUARIO NORMAL
  // ========================================
  const cargarDatosUsuario = async () => {
    try {
      // Obtener MIS inscripciones
      const misInscripcionesRes = await inscripcionesAPI.misInscripciones().catch(() => []);
      const misInscripciones = Array.isArray(misInscripcionesRes.data) 
        ? misInscripcionesRes.data 
        : misInscripcionesRes.data?.inscripciones || [];

      console.log('📋 Mis inscripciones:', misInscripciones);

      // Obtener TODOS los eventos disponibles
      const eventosRes = await eventosAPI.obtenerTodos().catch(() => ({ data: { data: { eventos: [] } } }));
      const todosEventos = eventosRes.data?.data?.eventos || eventosRes.data || [];

      // Filtrar eventos futuros
      const ahora = new Date();
      const eventosFuturos = todosEventos.filter(e => {
        if (!e.fecha) return false;
        const fechaEvento = new Date(e.fecha);
        return fechaEvento >= ahora;
      });

      // Contar inscripciones activas (no canceladas)
      const inscripcionesActivas = misInscripciones.filter(
        i => i.estado !== 'cancelada'
      ).length;

      setStatsUsuario({
        misInscripciones: inscripcionesActivas,
        eventosDisponibles: eventosFuturos.length,
        proximosEventos: eventosFuturos.slice(0, 3).length
      });

      // Eventos próximos disponibles (no inscritos aún)
      const idsEventosInscritos = misInscripciones
        .filter(i => i.estado !== 'cancelada')
        .map(i => i.id_evento_mongo);

      const eventosDisponibles = eventosFuturos
        .filter(e => !idsEventosInscritos.includes(e._id))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 4)
        .map(evento => ({
          id: evento._id,
          titulo: evento.titulo,
          fecha: formatearFechaCorta(evento.fecha),
          lugar: evento.lugar,
          precio: evento.precio || 0,
          color: obtenerColorAleatorio()
        }));

      setEventosProximos(eventosDisponibles);

      // Mis inscripciones recientes con información del evento
      const inscripcionesConEvento = misInscripciones
        .filter(i => i.estado !== 'cancelada' && i.evento)
        .sort((a, b) => new Date(b.fecha_inscripcion) - new Date(a.fecha_inscripcion))
        .slice(0, 3)
        .map(i => ({
          id: i.id,
          titulo: i.evento?.titulo || 'Evento sin título',
          fecha: formatearFechaCorta(i.evento?.fecha),
          estado: i.estado,
          lugar: i.evento?.lugar || 'Sin ubicación'
        }));

      setMisInscripcionesRecientes(inscripcionesConEvento);

    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
    }
  };

  // Utilidades
  const formatearFechaCorta = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = date.getDate();
    const mes = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
    return `${dia} ${mes}`;
  };

  const obtenerColorAleatorio = () => {
    const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    return colores[Math.floor(Math.random() * colores.length)];
  };

  const obtenerColorEstado = (estado) => {
    const colores = {
      'confirmada': '#10b981',
      'pendiente': '#f59e0b',
      'cancelada': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Bienvenido de nuevo, <span style={{ fontWeight: '600', color: '#2563eb' }}>{usuario?.nombre}</span> 👋
        </p>
      </div>

      {/* ========================================
          DASHBOARD DE ADMINISTRADOR
          ======================================== */}
      {esAdministrativo ? (
        <>
          {/* Stats Grid Admin */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <StatCard
              icon={Calendar}
              label="Eventos Activos"
              value={statsAdmin.eventos}
              color="#3b82f6"
            />
            <StatCard
              icon={Users}
              label="Usuarios Registrados"
              value={statsAdmin.usuarios.toLocaleString()}
              color="#8b5cf6"
            />
            <StatCard
              icon={UserCheck}
              label="Inscripciones"
              value={statsAdmin.inscripciones}
              color="#10b981"
            />
            <StatCard
              icon={DollarSign}
              label="Ingresos Totales"
              value={`$${statsAdmin.ingresos.toLocaleString()}`}
              color="#f59e0b"
            />
          </div>

          {/* Content Grid Admin */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {/* Eventos Próximos */}
            <Card style={{ gridColumn: 'span 2' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Eventos Próximos
                </h2>
              </div>

              {eventosProximos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <Calendar size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p>No hay eventos próximos programados</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {eventosProximos.map((evento) => (
                    <div
                      key={evento.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid transparent'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '14px',
                        backgroundColor: evento.color,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: `0 4px 12px ${evento.color}40`,
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{evento.fecha.split(' ')[0]}</span>
                        <span style={{ fontSize: '0.75rem' }}>{evento.fecha.split(' ')[1]}</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '6px',
                          fontSize: '1rem'
                        }}>
                          {evento.titulo}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} />
                            {evento.lugar}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={14} />
                            {evento.inscritos} inscritos
                          </span>
                        </div>
                      </div>

                      <Clock size={20} color="#9ca3af" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* ========================================
              DASHBOARD DE USUARIO NORMAL
              ======================================== */}
          
          {/* Stats Grid Usuario */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <StatCard
              icon={Ticket}
              label="Mis Inscripciones"
              value={statsUsuario.misInscripciones}
              color="#3b82f6"
            />
            <StatCard
              icon={Calendar}
              label="Eventos Disponibles"
              value={statsUsuario.eventosDisponibles}
              color="#10b981"
            />
            <StatCard
              icon={TrendingUp}
              label="Próximos Eventos"
              value={statsUsuario.proximosEventos}
              color="#8b5cf6"
            />
          </div>

          {/* Content Grid Usuario */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {/* Eventos Disponibles */}
            <Card>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Eventos Disponibles
              </h2>

              {eventosProximos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <Calendar size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p>No hay eventos disponibles</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {eventosProximos.map((evento) => (
                    <div
                      key={evento.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '2px solid transparent'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      onClick={() => window.location.href = '/eventos'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '1rem',
                          margin: 0
                        }}>
                          {evento.titulo}
                        </h3>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: evento.precio > 0 ? '#f59e0b' : '#10b981',
                          backgroundColor: evento.precio > 0 ? '#fef3c7' : '#d1fae5',
                          padding: '4px 12px',
                          borderRadius: '8px'
                        }}>
                          {evento.precio > 0 ? `$${evento.precio.toLocaleString()}` : 'Gratis'}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {evento.fecha}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} />
                          {evento.lugar}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Mis Inscripciones Recientes */}
            <Card>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Mis Inscripciones
              </h2>

              {misInscripcionesRecientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <Ticket size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p>No tienes inscripciones activas</p>
                  <button
                    onClick={() => window.location.href = '/eventos'}
                    style={{
                      marginTop: '16px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Explorar Eventos
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {misInscripcionesRecientes.map((inscripcion) => (
                    <div
                      key={inscripcion.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        borderLeft: `4px solid ${obtenerColorEstado(inscripcion.estado)}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onClick={() => window.location.href = '/mis-inscripciones'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '0.95rem',
                          margin: 0
                        }}>
                          {inscripcion.titulo}
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: obtenerColorEstado(inscripcion.estado),
                          textTransform: 'uppercase'
                        }}>
                          {inscripcion.estado}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {inscripcion.fecha}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} />
                          {inscripcion.lugar}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;