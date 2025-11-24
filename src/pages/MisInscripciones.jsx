import { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Clock, XCircle, CheckCircle, DollarSign } from 'lucide-react';
import Card from '../components/common/Card';
import { inscripcionesAPI } from '../services/api';

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMisInscripciones();
  }, []);

  const cargarMisInscripciones = async () => {
    try {
      const response = await inscripcionesAPI.misInscripciones();
      setInscripciones(response.data || []);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarInscripcion = async (id, esGratis) => {
    if (!esGratis) {
      alert('No puedes cancelar una inscripción de pago. Contacta al administrador.');
      return;
    }

    if (window.confirm('¿Estás seguro de cancelar esta inscripción?')) {
      try {
        await inscripcionesAPI.cancelar(id);
        cargarMisInscripciones();
        alert('Inscripción cancelada exitosamente');
      } catch (error) {
        alert('Error al cancelar: ' + (error.response?.data?.mensaje || error.message));
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Mis Inscripciones
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Gestiona tus inscripciones a eventos
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : inscripciones.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Ticket size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              No tienes inscripciones aún
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {inscripciones.map((inscripcion) => (
            <Card key={inscripcion._id}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Calendar size={40} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>
                    {inscripcion.id_evento?.titulo}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.875rem' }}>
                      <Calendar size={16} />
                      {new Date(inscripcion.id_evento?.fecha).toLocaleDateString('es-ES')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.875rem' }}>
                      <MapPin size={16} />
                      {inscripcion.id_evento?.lugar}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>
                      <DollarSign size={16} />
                      {inscripcion.id_evento?.precio === 0 ? 'Gratis' : `$${inscripcion.id_evento?.precio}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      backgroundColor: inscripcion.estado === 'confirmada' ? '#d1fae5' : '#fef3c7',
                      color: inscripcion.estado === 'confirmada' ? '#065f46' : '#92400e'
                    }}>
                      {inscripcion.estado === 'confirmada' ? (
                        <><CheckCircle size={16} style={{ display: 'inline', marginRight: '4px' }} /> Confirmada</>
                      ) : (
                        <><Clock size={16} style={{ display: 'inline', marginRight: '4px' }} /> Pendiente</>
                      )}
                    </span>

                    {inscripcion.id_evento?.precio === 0 && inscripcion.estado !== 'cancelada' && (
                      <button
                        onClick={() => cancelarInscripcion(inscripcion._id, true)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={16} />
                        Cancelar Inscripción
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default MisInscripciones;


