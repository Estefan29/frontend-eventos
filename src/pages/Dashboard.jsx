import { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, UserCheck, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import { eventosAPI, usuariosAPI, inscripcionesAPI, pagosAPI } from '../services/api';

const Dashboard = () => {
  const { usuario } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventos: 0,
    usuarios: 0,
    inscripciones: 0,
    ingresos: 0
  });
  const [eventosProximos, setEventosProximos] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas en paralelo
      const [eventosRes, usuariosRes, inscripcionesRes, pagosRes] = await Promise.all([
        eventosAPI.obtenerTodos().catch(() => ({ data: { data: { eventos: [] } } })),
        usuariosAPI.obtenerTodos().catch(() => ({ data: { data: { usuarios: [] } } })),
        inscripcionesAPI.obtenerTodas().catch(() => ({ data: [] })),
        pagosAPI.obtenerTodos().catch(() => ({ data: [] }))
      ]);

      // Extraer datos
      const eventos = eventosRes.data?.data?.eventos || eventosRes.data || [];
      const usuarios = usuariosRes.data?.data?.usuarios || usuariosRes.data || [];
      const inscripciones = inscripcionesRes.data || [];
      const pagos = pagosRes.data || [];

      // Calcular ingresos totales
      const ingresosTotal = pagos
        .filter(p => p.estado === 'completado')
        .reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);

      // Actualizar stats
      setStats({
        eventos: eventos.length,
        usuarios: usuarios.length,
        inscripciones: inscripciones.length,
        ingresos: Math.round(ingresosTotal)
      });

      // Filtrar y ordenar eventos próximos (eventos futuros ordenados por fecha)
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

      // Generar actividad reciente (últimas inscripciones y pagos)
      const actividades = [];
      
      // Últimas inscripciones
      const ultimasInscripciones = inscripciones
        .sort((a, b) => new Date(b.fecha_inscripcion) - new Date(a.fecha_inscripcion))
        .slice(0, 3);
      
      ultimasInscripciones.forEach(i => {
        actividades.push({
          id: `ins-${i._id}`,
          texto: `Nueva inscripción a ${i.id_evento?.titulo || 'evento'}`,
          tiempo: calcularTiempoTranscurrido(i.fecha_inscripcion)
        });
      });

      // Últimos pagos completados
      const ultimosPagos = pagos
        .filter(p => p.estado === 'completado')
        .sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))
        .slice(0, 2);
      
      ultimosPagos.forEach(p => {
        actividades.push({
          id: `pago-${p.id}`,
          texto: `Pago confirmado - $${Math.round(p.monto).toLocaleString()}`,
          tiempo: calcularTiempoTranscurrido(p.fecha_pago)
        });
      });

      // Ordenar por tiempo y tomar las 5 más recientes
      actividades.sort((a, b) => {
        const tiempoA = parsearTiempo(a.tiempo);
        const tiempoB = parsearTiempo(b.tiempo);
        return tiempoA - tiempoB;
      });

      setActividadReciente(actividades.slice(0, 5));

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
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

  const calcularTiempoTranscurrido = (fecha) => {
    if (!fecha) return 'Hace un momento';
    const ahora = new Date();
    const fechaPasada = new Date(fecha);
    const diffMs = ahora - fechaPasada;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const parsearTiempo = (tiempo) => {
    if (tiempo === 'Hace un momento') return 0;
    const num = parseInt(tiempo);
    if (tiempo.includes('min')) return num;
    if (tiempo.includes('hora')) return num * 60;
    if (tiempo.includes('día')) return num * 1440;
    return 999999;
  };

  const obtenerColorAleatorio = () => {
    const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    return colores[Math.floor(Math.random() * colores.length)];
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

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon={Calendar}
          label="Eventos Activos"
          value={stats.eventos}
          color="#3b82f6"
        />
        <StatCard
          icon={Users}
          label="Usuarios Registrados"
          value={stats.usuarios.toLocaleString()}
          color="#8b5cf6"
        />
        <StatCard
          icon={UserCheck}
          label="Inscripciones"
          value={stats.inscripciones}
          color="#10b981"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos Totales"
          value={`$${stats.ingresos.toLocaleString()}`}
          color="#f59e0b"
        />
      </div>

      {/* Content Grid */}
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

        {/* Actividad Reciente */}
        <Card>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px'
          }}>
            Actividad Reciente
          </h2>

          {actividadReciente.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <Clock size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
              <p>No hay actividad reciente</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {actividadReciente.map((actividad) => (
                <div
                  key={actividad.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderLeft: '3px solid #3b82f6',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0 12px 12px 0',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                    e.currentTarget.style.paddingLeft = '16px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.paddingLeft = '12px';
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    marginTop: '6px',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {actividad.texto}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Hace {actividad.tiempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

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