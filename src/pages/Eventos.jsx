import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, MapPin, Users, X, UserPlus, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { eventosAPI, inscripcionesAPI } from '../services/api';
import Card from '../components/common/Card';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInscripcion, setModalInscripcion] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoInscribirse, setEventoInscribirse] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    capacidad: '',
    precio: ''
  });
  const { usuario } = useAuthStore();

  const esAdmin = usuario?.rol === 'admin';
  const esAdministrativo = usuario?.rol === 'administrativo';
  const tieneAccesoCompleto = esAdmin || esAdministrativo;
  const esUsuarioRegular = ['estudiante', 'profesor', 'externo'].includes(usuario?.rol);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
  try {
    setLoading(true);
    
    // Cargar eventos
    const eventosRes = await eventosAPI.obtenerTodos();
    console.log('📅 Eventos response:', eventosRes.data);
    
    // Manejar diferentes estructuras de respuesta
    const eventosData = eventosRes.data.data?.eventos || 
                       eventosRes.data.eventos || 
                       eventosRes.data || 
                       [];
    
    setEventos(Array.isArray(eventosData) ? eventosData : []);
    
    // Cargar inscripciones solo para usuarios regulares
    if (esUsuarioRegular) {
      try {
        const inscripcionesRes = await inscripcionesAPI.misInscripciones();
        console.log('📝 Mis inscripciones response:', inscripcionesRes.data);
        
        // Manejar diferentes estructuras de respuesta
        const inscripcionesData = inscripcionesRes.data.data || 
                                 inscripcionesRes.data || 
                                 [];
        
        setMisInscripciones(Array.isArray(inscripcionesData) ? inscripcionesData : []);
      } catch (inscripcionError) {
        console.warn('No se pudieron cargar las inscripciones:', inscripcionError);
        setMisInscripciones([]);
      }
    }
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    setEventos([]);
  } finally {
    setLoading(false);
  }
};

 const estaInscrito = (eventoId) => {
  // Asegurarnos de que misInscripciones sea un array
  if (!Array.isArray(misInscripciones)) {
    console.warn('⚠️ misInscripciones no es un array:', misInscripciones);
    return false;
  }
  
  return misInscripciones.some(inscripcion => {
    // Verificar diferentes estructuras de respuesta
    const idEvento = inscripcion.id_evento_mongo || 
                    inscripcion.evento?._id || 
                    inscripcion.evento;
    
    return idEvento === eventoId;
  });
};

  const handleInscripcion = async () => {
    if (!eventoInscribirse) return;
    
    try {
      await inscripcionesAPI.crear({
        id_evento_mongo: eventoInscribirse._id,
        id_usuario_mongo: usuario._id
      });
      
      alert('¡Inscripción exitosa! ' + 
        (eventoInscribirse.precio === 0 
          ? 'Tu lugar ha sido reservado.' 
          : 'Se te redirigirá al pago.'));
      
      setModalInscripcion(false);
      setEventoInscribirse(null);
      cargarDatos();
    } catch (error) {
      alert('Error al inscribirse: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    try {
      if (eventoEditando) {
        await eventosAPI.actualizar(eventoEditando._id, formData);
        alert('Evento actualizado exitosamente');
      } else {
        await eventosAPI.crear(formData);
        alert('Evento creado exitosamente');
      }
      cargarDatos();
      cerrarModal();
    } catch (error) {
      alert('Error al guardar evento: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await eventosAPI.eliminar(id);
        alert('Evento eliminado exitosamente');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar: ' + (error.response?.data?.mensaje || error.message));
      }
    }
  };

  const abrirModal = (evento = null) => {
    if (evento) {
      setEventoEditando(evento);
      setFormData({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: evento.fecha?.split('T')[0] || '',
        lugar: evento.lugar,
        capacidad: evento.capacidad,
        precio: evento.precio
      });
    } else {
      setEventoEditando(null);
      setFormData({
        titulo: '',
        descripcion: '',
        fecha: '',
        lugar: '',
        capacidad: '',
        precio: ''
      });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEventoEditando(null);
  };

  const eventosFiltrados = eventos.filter(evento =>
    evento.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.lugar?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eventoLleno = (evento) => {
    return evento.capacidad && evento.inscritos >= evento.capacidad;
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in', fontFamily: 'system-ui' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {tieneAccesoCompleto ? 'Gestión de Eventos' : 'Eventos Disponibles'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            {tieneAccesoCompleto 
              ? 'Administra todos los eventos de la universidad'
              : 'Explora y inscríbete a nuestros eventos'}
          </p>
        </div>
        
        {tieneAccesoCompleto && (
          <button
            onClick={() => abrirModal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={20} />
            Crear Evento
          </button>
        )}
      </div>

      {/* Search Bar */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={20}
            color="#9ca3af"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </Card>

      {/* Eventos Grid */}
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
      ) : eventosFiltrados.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Calendar size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {busqueda ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
            </p>
          </div>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {eventosFiltrados.map((evento) => {
            const yaInscrito = estaInscrito(evento._id);
            const lleno = eventoLleno(evento);
            
            return (
              <Card key={evento._id} hover={true}>
                {/* Imagen del Evento */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: 'bold'
                }}>
                  {evento.titulo.charAt(0)}
                </div>

                {/* Estado de la Inscripción */}
                {esUsuarioRegular && (
                  <div style={{ marginBottom: '12px' }}>
                    {yaInscrito ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        <CheckCircle size={16} />
                        Ya estás inscrito
                      </span>
                    ) : lleno ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        <AlertCircle size={16} />
                        Cupos agotados
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Título y Descripción */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  {evento.titulo}
                </h3>
                
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {evento.descripcion}
                </p>

                {/* Info del Evento */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <Calendar size={16} />
                    {new Date(evento.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    {evento.lugar}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <Users size={16} />
                    {evento.inscritos || 0} / {evento.capacidad || '∞'} inscritos
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '1rem' }}>
                    <DollarSign size={18} color={evento.precio === 0 ? '#10b981' : '#f59e0b'} />
                    <span style={{ color: evento.precio === 0 ? '#10b981' : '#f59e0b' }}>
                      {evento.precio === 0 ? 'Gratis' : `$${evento.precio.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  {tieneAccesoCompleto ? (
                    <>
                      <button
                        onClick={() => abrirModal(evento)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#dbeafe',
                          color: '#2563eb',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(evento._id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#fee2e2',
                          color: '#dc2626',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (!yaInscrito && !lleno) {
                          setEventoInscribirse(evento);
                          setModalInscripcion(true);
                        }
                      }}
                      disabled={yaInscrito || lleno}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: yaInscrito || lleno
                          ? '#f3f4f6' 
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: yaInscrito || lleno ? '#9ca3af' : 'white',
                        fontWeight: '600',
                        cursor: yaInscrito || lleno ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: yaInscrito || lleno ? 'none' : '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        if (!yaInscrito && !lleno) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!yaInscrito && !lleno) {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {yaInscrito ? (
                        <>
                          <CheckCircle size={20} />
                          Inscrito
                        </>
                      ) : lleno ? (
                        <>
                          <AlertCircle size={20} />
                          Lleno
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} />
                          Inscribirse
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Crear/Editar Evento */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px',
          animation: 'fadeIn 0.2s'
        }}
        onClick={cerrarModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {eventoEditando ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h2>
              <button
                onClick={cerrarModal}
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvento} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Título del Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      outline: 'none',
                      transition: 'border 0.2s',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Lugar *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lugar}
                      onChange={(e) => setFormData({...formData, lugar: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Capacidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                      placeholder="Dejar vacío para ilimitado"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      placeholder="0 para evento gratuito"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={cerrarModal}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {eventoEditando ? 'Guardar Cambios' : 'Crear Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Inscripción */}
      {modalInscripcion && eventoInscribirse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px',
          animation: 'fadeIn 0.2s'
        }}
        onClick={() => setModalInscripcion(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              animation: 'slideUp 0.3s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px 20px 0 0',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                Confirmar Inscripción
              </h2>
              <button
                onClick={() => setModalInscripcion(false)}
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  color: 'white'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                marginBottom: '24px'
              }}>
                <Calendar size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  {eventoInscribirse.titulo}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px' }}>
                  {new Date(eventoInscribirse.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: eventoInscribirse.precio === 0 ? '#10b981' : '#f59e0b' }}>
                  {eventoInscribirse.precio === 0 ? 'Evento Gratuito' : `$${eventoInscribirse.precio.toLocaleString()}`}
                </p>
              </div>

              {eventoInscribirse.precio > 0 && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '2px solid #fbbf24'
                }}>
                  <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} />
                    Después de confirmar, serás redirigido a la página de pago.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setModalInscripcion(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleInscripcion}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <UserPlus size={18} />
                  Confirmar Inscripción
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Eventos;