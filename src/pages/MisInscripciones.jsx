import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { inscripcionesAPI } from '../services/api';
import Card from '../components/common/Card';

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuthStore();

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await inscripcionesAPI.misInscripciones();
      console.log('📝 Respuesta completa de mis inscripciones:', response);
      console.log('📝 Data:', response.data);
      
      // Manejar diferentes estructuras de respuesta del backend
      let inscripcionesData = [];
      
      if (response.data) {
        // Si viene con estructura { status, data: [...] }
        if (response.data.data && Array.isArray(response.data.data)) {
          inscripcionesData = response.data.data;
        }
        // Si viene directamente como array
        else if (Array.isArray(response.data)) {
          inscripcionesData = response.data;
        }
        // Si viene con estructura { status, data: { inscripciones: [...] } }
        else if (response.data.data?.inscripciones && Array.isArray(response.data.data.inscripciones)) {
          inscripcionesData = response.data.data.inscripciones;
        }
        // Si viene como objeto con la propiedad inscripciones
        else if (response.data.inscripciones && Array.isArray(response.data.inscripciones)) {
          inscripcionesData = response.data.inscripciones;
        }
      }
      
      console.log('✅ Inscripciones procesadas:', inscripcionesData);
      setInscripciones(inscripcionesData);
      
    } catch (err) {
      console.error('❌ Error al cargar inscripciones:', err);
      console.error('❌ Detalle del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.mensaje || 'Error al cargar las inscripciones');
      setInscripciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta inscripción? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await inscripcionesAPI.cancelar(id);
      alert('Inscripción cancelada exitosamente');
      cargarInscripciones();
    } catch (error) {
      alert('Error al cancelar: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      confirmada: {
        bg: '#d1fae5',
        color: '#065f46',
        icon: CheckCircle,
        text: 'Confirmada'
      },
      pendiente: {
        bg: '#fef3c7',
        color: '#92400e',
        icon: Clock,
        text: 'Pendiente de Pago'
      },
      cancelada: {
        bg: '#fee2e2',
        color: '#991b1b',
        icon: XCircle,
        text: 'Cancelada'
      }
    };

    const estadoInfo = estados[estado] || estados.pendiente;
    const Icon = estadoInfo.icon;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        backgroundColor: estadoInfo.bg,
        color: estadoInfo.color,
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        <Icon size={16} />
        {estadoInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</p>
        <button
          onClick={cargarInscripciones}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Mis Inscripciones
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Gestiona tus eventos inscritos
        </p>
      </div>

      {!Array.isArray(inscripciones) ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <AlertCircle size={64} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Error: Los datos no tienen el formato esperado
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '8px' }}>
              Tipo recibido: {typeof inscripciones}
            </p>
          </div>
        </Card>
      ) : inscripciones.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Calendar size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '8px' }}>
              No tienes inscripciones aún
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Explora nuestros eventos y regístrate en uno
            </p>
            <button
              onClick={() => window.location.href = '/eventos'}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Ver Eventos Disponibles
            </button>
          </div>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {inscripciones.map((inscripcion) => {
            // Manejar diferentes estructuras del evento
            const evento = inscripcion.evento || inscripcion.id_evento || {};
            const eventoTitulo = evento.titulo || 'Evento sin título';
            const eventoFecha = evento.fecha || inscripcion.fecha_evento;
            const eventoLugar = evento.lugar || 'Lugar no especificado';
            const eventoPrecio = evento.precio ?? 0;

            return (
              <Card key={inscripcion.id || inscripcion._id} hover={true}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '20px',
                  alignItems: 'start'
                }}>
                  {/* Información del Evento */}
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      {getEstadoBadge(inscripcion.estado)}
                    </div>

                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '12px'
                    }}>
                      {eventoTitulo}
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      color: '#6b7280'
                    }}>
                      {eventoFecha && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={18} />
                          <span>
                            {new Date(eventoFecha).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} />
                        <span>{eventoLugar}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={18} color={eventoPrecio === 0 ? '#10b981' : '#f59e0b'} />
                        <span style={{ 
                          fontWeight: '600', 
                          color: eventoPrecio === 0 ? '#10b981' : '#f59e0b' 
                        }}>
                          {eventoPrecio === 0 ? 'Gratis' : `$${eventoPrecio.toLocaleString()}`}
                        </span>
                      </div>

                      {inscripcion.fecha_inscripcion && (
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '0.875rem', 
                          color: '#9ca3af' 
                        }}>
                          Inscrito el: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {inscripcion.estado === 'pendiente' && (
                      <button
                        onClick={() => window.location.href = `/pago/${inscripcion.id || inscripcion._id}`}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Pagar Ahora
                      </button>
                    )}

                    {inscripcion.estado !== 'cancelada' && (
                      <button
                        onClick={() => handleCancelar(inscripcion.id || inscripcion._id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '2px solid #ef4444',
                          background: 'white',
                          color: '#ef4444',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MisInscripciones;