import { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, UserCheck, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { usuario } = useAuthStore();
  const [stats, setStats] = useState({
    eventos: 24,
    usuarios: 1247,
    inscripciones: 856,
    ingresos: 45890
  });

  const eventosProximos = [
    { id: 1, titulo: 'Hackathon USC 2024', fecha: '25 Dic', inscritos: 45, lugar: 'Auditorio', color: '#3b82f6' },
    { id: 2, titulo: 'Conferencia IA', fecha: '28 Dic', inscritos: 78, lugar: 'Sala 401', color: '#8b5cf6' },
    { id: 3, titulo: 'Workshop React', fecha: '30 Dic', inscritos: 30, lugar: 'Lab Sistemas', color: '#06b6d4' },
    { id: 4, titulo: 'Feria Empresarial', fecha: '05 Ene', inscritos: 120, lugar: 'Campus', color: '#10b981' },
  ];

  const actividadReciente = [
    { id: 1, texto: 'Nueva inscripción a Hackathon USC', tiempo: '5 min' },
    { id: 2, texto: 'Pago confirmado - $15,000', tiempo: '12 min' },
    { id: 3, texto: 'Nuevo usuario registrado', tiempo: '30 min' },
    { id: 4, texto: 'Evento "Conferencia IA" actualizado', tiempo: '1 hora' },
    { id: 5, texto: 'Certificado generado para Workshop', tiempo: '2 horas' },
  ];

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
          change="+12%"
          trend="up"
          color="#3b82f6"
        />
        <StatCard
          icon={Users}
          label="Usuarios Registrados"
          value={stats.usuarios.toLocaleString()}
          change="+8%"
          trend="up"
          color="#8b5cf6"
        />
        <StatCard
          icon={UserCheck}
          label="Inscripciones"
          value={stats.inscripciones}
          change="+23%"
          trend="up"
          color="#10b981"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos Totales"
          value={`$${stats.ingresos.toLocaleString()}`}
          change="+15%"
          trend="up"
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
            <button style={{
              color: '#2563eb',
              fontWeight: '600',
              fontSize: '0.875rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Ver todos →
            </button>
          </div>

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
        </Card>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;