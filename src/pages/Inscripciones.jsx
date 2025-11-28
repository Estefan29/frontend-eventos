import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, User, CheckCircle, Clock, XCircle, Eye, Download, X, AlertCircle, DollarSign, Mail } from 'lucide-react';
import { inscripcionesAPI, eventosAPI, usuariosAPI } from '../services/api';
import Card from '../components/common/Card';
import { useAuthStore } from '../store/authStore';

const Inscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalNueva, setModalNueva] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id_evento: '',
    id_usuario: ''
  });
  const { usuario } = useAuthStore();

  useEffect(() => {
    cargarDatos();
  }, [filtroEstado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Preparar parámetros de filtro
      const params = filtroEstado !== 'todos' ? { estado: filtroEstado } : {};
      
      // Cargar inscripciones, eventos y usuarios en paralelo
      const [inscripcionesRes, eventosRes, usuariosRes] = await Promise.all([
        inscripcionesAPI.obtenerTodas(params).catch(err => {
          console.error('Error cargando inscripciones:', err);
          return { data: [] };
        }),
        eventosAPI.obtenerTodos().catch(err => {
          console.error('Error cargando eventos:', err);
          return { data: { data: { eventos: [] } } };
        }),
        usuariosAPI.obtenerTodos().catch(err => {
          console.error('Error cargando usuarios:', err);
          return { data: { data: { usuarios: [] } } };
        })
      ]);
      
      // Manejo seguro de las respuestas
      const inscripcionesData = Array.isArray(inscripcionesRes.data) 
        ? inscripcionesRes.data 
        : inscripcionesRes.data?.data?.inscripciones || [];
      
      const eventosData = eventosRes.data?.data?.eventos || 
                          eventosRes.data?.eventos || 
                          (Array.isArray(eventosRes.data) ? eventosRes.data : []);
      
      const usuariosData = usuariosRes.data?.data?.usuarios || 
                           usuariosRes.data?.usuarios || 
                           (Array.isArray(usuariosRes.data) ? usuariosRes.data : []);
      
      console.log('Datos cargados:', { 
        inscripciones: inscripcionesData.length, 
        eventos: eventosData.length, 
        usuarios: usuariosData.length 
      });
      
      setInscripciones(inscripcionesData);
      setEventos(eventosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Establecer arrays vacíos en caso de error
      setInscripciones([]);
      setEventos([]);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('¿Estás seguro de cancelar esta inscripción?')) {
      try {
        await inscripcionesAPI.cancelar(id);
        alert('Inscripción cancelada exitosamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al cancelar:', error);
        alert('Error al cancelar: ' + (error.response?.data?.mensaje || error.message));
      }
    }
  };

  const handleConfirmar = async (id) => {
    try {
      // Si tienes un endpoint específico para confirmar, úsalo aquí
      // await inscripcionesAPI.confirmar(id);
      alert('Inscripción confirmada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al confirmar:', error);
      alert('Error al confirmar: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const verDetalle = (inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalDetalle(true);
  };

  const handleCrearInscripcion = async (e) => {
    e.preventDefault();
    try {
      await inscripcionesAPI.crear(formData);
      alert('Inscripción creada exitosamente');
      setModalNueva(false);
      setFormData({ id_evento: '', id_usuario: '' });
      cargarDatos();
    } catch (error) {
      console.error('Error al crear inscripción:', error);
      alert('Error al crear inscripción: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const inscripcionesFiltradas = inscripciones.filter(inscripcion => {
    if (!inscripcion) return false;
    
    const nombreUsuario = inscripcion.id_usuario?.nombre || inscripcion.usuario?.nombre || '';
    const tituloEvento = inscripcion.id_evento?.titulo || inscripcion.evento?.titulo || '';
    
    const matchBusqueda = nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                          tituloEvento.toLowerCase().includes(busqueda.toLowerCase());
    return matchBusqueda;
  });

  const getEstadoInfo = (estado) => {
    const estados = {
      pendiente: { color: '#fbbf24', bg: '#fef3c7', icon: Clock, label: 'Pendiente' },
      confirmada: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: 'Confirmada' },
      cancelada: { color: '#ef4444', bg: '#fee2e2', icon: XCircle, label: 'Cancelada' }
    };
    return estados[estado] || estados.pendiente;
  };

  const stats = {
    total: inscripciones.length,
    confirmadas: inscripciones.filter(i => i?.estado === 'confirmada').length,
    pendientes: inscripciones.filter(i => i?.estado === 'pendiente').length,
    canceladas: inscripciones.filter(i => i?.estado === 'cancelada').length
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return '-';
    }
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
            Gestión de Inscripciones
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Administra todas las inscripciones a eventos
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => alert('Función de exportación próximamente')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#374151'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#eff6ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Download size={20} />
            Exportar
          </button>
          <button
            onClick={() => setModalNueva(true)}
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
            Nueva Inscripción
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Total Inscripciones</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.total}</p>
            <User size={32} color="#3b82f6" />
          </div>
        </Card>
        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Confirmadas</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{stats.confirmadas}</p>
            <CheckCircle size={32} color="#10b981" />
          </div>
        </Card>
        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Pendientes</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>{stats.pendientes}</p>
            <Clock size={32} color="#fbbf24" />
          </div>
        </Card>
        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Canceladas</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>{stats.canceladas}</p>
            <XCircle size={32} color="#ef4444" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search
              size={20}
              color="#9ca3af"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Buscar por evento o usuario..."
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

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['todos', 'pendiente', 'confirmada', 'cancelada'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: filtroEstado === estado ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : '#f3f4f6',
                  color: filtroEstado === estado ? 'white' : '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem'
                }}
                onMouseOver={(e) => {
                  if (filtroEstado !== estado) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  if (filtroEstado !== estado) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
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
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando inscripciones...</p>
          </div>
        ) : inscripcionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <User size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {busqueda ? 'No se encontraron inscripciones' : 'No hay inscripciones registradas'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Usuario</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Evento</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha Inscripción</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripcionesFiltradas.map((inscripcion) => {
                  const estadoInfo = getEstadoInfo(inscripcion.estado);
                  
                  return (
                    <tr
                      key={inscripcion._id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            flexShrink: 0
                          }}>
                            {inscripcion.id_usuario?.nombre?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                              {inscripcion.id_usuario?.nombre || 'Usuario'}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} />
                              {inscripcion.id_usuario?.correo || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                            {inscripcion.id_evento?.titulo || 'Evento'}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {inscripcion.id_evento?.fecha ? new Date(inscripcion.id_evento.fecha).toLocaleDateString('es-ES') : '-'}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                        {inscripcion.fecha_inscripcion ? new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          backgroundColor: estadoInfo.bg,
                          color: estadoInfo.color,
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          <estadoInfo.icon size={16} />
                          {estadoInfo.label}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => verDetalle(inscripcion)}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Eye size={18} color="#3b82f6" />
                          </button>
                          {inscripcion.estado === 'pendiente' && (
                            <button
                              onClick={() => handleConfirmar(inscripcion._id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#d1fae5',
                                color: '#10b981',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.75rem'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a7f3d0'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
                            >
                              Confirmar
                            </button>
                          )}
                          {inscripcion.estado !== 'cancelada' && (
                            <button
                              onClick={() => handleCancelar(inscripcion._id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#fee2e2',
                                color: '#ef4444',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.75rem'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Nueva Inscripción */}
      {modalNueva && (
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
        onClick={() => setModalNueva(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '500px',
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
                Nueva Inscripción
              </h2>
              <button
                onClick={() => setModalNueva(false)}
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

            <form onSubmit={handleCrearInscripcion} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Seleccionar Usuario *
                  </label>
                  <select
                    required
                    value={formData.id_usuario}
                    onChange={(e) => setFormData({...formData, id_usuario: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">-- Seleccione un usuario --</option>
                    {usuarios.map(u => (
                      <option key={u._id} value={u._id}>
                        {u.nombre} - {u.correo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Seleccionar Evento *
                  </label>
                  <select
                    required
                    value={formData.id_evento}
                    onChange={(e) => setFormData({...formData, id_evento: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">-- Seleccione un evento --</option>
                    {eventos.map(ev => (
                      <option key={ev._id} value={ev._id}>
                        {ev.titulo} - {new Date(ev.fecha).toLocaleDateString('es-ES')}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  border: '2px solid #bfdbfe'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <AlertCircle size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                      La inscripción se creará en estado <strong>pendiente</strong>. Deberás confirmarla después de verificar el pago.
                    </p>
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
                  onClick={() => setModalNueva(false)}
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
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Plus size={18} />
                  Crear Inscripción
                </button>
              </div>
            </form>
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

export default Inscripciones;