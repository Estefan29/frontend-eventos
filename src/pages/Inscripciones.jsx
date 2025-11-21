import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, User, CheckCircle, Clock, XCircle, Eye, Download, X, AlertCircle, DollarSign, Mail } from 'lucide-react';

// Componente Card reutilizable
const Card = ({ children, hover = true, style }) => {
  const baseStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    ...style
  };

  return (
    <div 
      style={baseStyle}
      onMouseOver={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};

const Inscripciones = () => {
  const [inscripciones, setInscripciones] = useState([
    {
      id: 1,
      id_usuario: 'Juan Pérez',
      usuario_email: 'juan@usc.edu.co',
      evento: { titulo: 'Hackathon USC 2024', fecha: '2024-12-25', lugar: 'Auditorio' },
      fecha_inscripcion: '2024-12-01',
      estado: 'confirmada',
      pago_estado: 'completado',
      monto_pago: 15000
    },
    {
      id: 2,
      id_usuario: 'María García',
      usuario_email: 'maria@usc.edu.co',
      evento: { titulo: 'Conferencia IA', fecha: '2024-12-28', lugar: 'Sala 401' },
      fecha_inscripcion: '2024-12-02',
      estado: 'pendiente',
      pago_estado: 'pendiente',
      monto_pago: 0
    },
    {
      id: 3,
      id_usuario: 'Carlos López',
      usuario_email: 'carlos@usc.edu.co',
      evento: { titulo: 'Workshop React', fecha: '2024-12-30', lugar: 'Lab Sistemas' },
      fecha_inscripcion: '2024-11-28',
      estado: 'confirmada',
      pago_estado: 'completado',
      monto_pago: 20000
    },
    {
      id: 4,
      id_usuario: 'Ana Martínez',
      usuario_email: 'ana@usc.edu.co',
      evento: { titulo: 'Feria Empresarial', fecha: '2025-01-05', lugar: 'Campus' },
      fecha_inscripcion: '2024-12-05',
      estado: 'cancelada',
      pago_estado: 'reembolsado',
      monto_pago: 0
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalNueva, setModalNueva] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id_evento: '',
    id_usuario: ''
  });

  const handleCancelar = (id) => {
    if (window.confirm('¿Estás seguro de cancelar esta inscripción?')) {
      setInscripciones(prev => 
        prev.map(i => i.id === id ? { ...i, estado: 'cancelada' } : i)
      );
    }
  };

  const handleConfirmar = (id) => {
    setInscripciones(prev => 
      prev.map(i => i.id === id ? { ...i, estado: 'confirmada' } : i)
    );
  };

  const verDetalle = (inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalDetalle(true);
  };

  const handleCrearInscripcion = (e) => {
    e.preventDefault();
    const nuevaInscripcion = {
      id: inscripciones.length + 1,
      id_usuario: 'Nuevo Usuario',
      usuario_email: 'nuevo@usc.edu.co',
      evento: { titulo: 'Evento Seleccionado', fecha: '2025-01-15', lugar: 'Por definir' },
      fecha_inscripcion: new Date().toISOString(),
      estado: 'pendiente',
      pago_estado: 'pendiente',
      monto_pago: 0
    };
    setInscripciones([...inscripciones, nuevaInscripcion]);
    setModalNueva(false);
    setFormData({ id_evento: '', id_usuario: '' });
  };

  const inscripcionesFiltradas = inscripciones.filter(inscripcion => {
    const matchBusqueda = inscripcion.evento?.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          inscripcion.id_usuario?.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || inscripcion.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const getEstadoInfo = (estado) => {
    const estados = {
      pendiente: { color: '#fbbf24', bg: '#fef3c7', icon: Clock, label: 'Pendiente' },
      confirmada: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: 'Confirmada' },
      cancelada: { color: '#ef4444', bg: '#fee2e2', icon: XCircle, label: 'Cancelada' }
    };
    return estados[estado] || estados.pendiente;
  };

  const getPagoEstadoInfo = (estado) => {
    const estados = {
      pendiente: { color: '#fbbf24', label: 'Pendiente' },
      completado: { color: '#10b981', label: 'Completado' },
      reembolsado: { color: '#6366f1', label: 'Reembolsado' }
    };
    return estados[estado] || estados.pendiente;
  };

  const stats = {
    total: inscripciones.length,
    confirmadas: inscripciones.filter(i => i.estado === 'confirmada').length,
    pendientes: inscripciones.filter(i => i.estado === 'pendiente').length,
    canceladas: inscripciones.filter(i => i.estado === 'cancelada').length
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
            onClick={() => alert('Exportando...')}
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Usuario</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Evento</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Pago</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripcionesFiltradas.map((inscripcion) => {
                  const estadoInfo = getEstadoInfo(inscripcion.estado);
                  const pagoInfo = getPagoEstadoInfo(inscripcion.pago_estado);
                  
                  return (
                    <tr
                      key={inscripcion.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          backgroundColor: '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          #{inscripcion.id}
                        </span>
                      </td>
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
                            {inscripcion.id_usuario?.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                              {inscripcion.id_usuario}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} />
                              {inscripcion.usuario_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                            {inscripcion.evento?.titulo}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {new Date(inscripcion.evento?.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: pagoInfo.color
                          }}>
                            {pagoInfo.label}
                          </span>
                          {inscripcion.monto_pago > 0 && (
                            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>
                              ${inscripcion.monto_pago.toLocaleString()}
                            </span>
                          )}
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
                              onClick={() => handleConfirmar(inscripcion.id)}
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
                              onClick={() => handleCancelar(inscripcion.id)}
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

      {/* Modal Detalle */}
      {modalDetalle && inscripcionSeleccionada && (
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
        onClick={() => setModalDetalle(false)}
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
              alignItems: 'center',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              borderRadius: '20px 20px 0 0',
              color: 'white'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                  Detalle de Inscripción
                </h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                  ID: #{inscripcionSeleccionada.id}
                </p>
              </div>
              <button
                onClick={() => setModalDetalle(false)}
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
              {/* Usuario */}
              <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Usuario
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                  }}>
                    {inscripcionSeleccionada.id_usuario?.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '4px' }}>
                      {inscripcionSeleccionada.id_usuario}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                      {inscripcionSeleccionada.usuario_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Evento */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Evento
                </label>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  border: '2px solid #bfdbfe'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '8px' }}>
                    {inscripcionSeleccionada.evento?.titulo}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={16} />
                      {new Date(inscripcionSeleccionada.evento?.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estados */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estado Inscripción
                  </label>
                  {(() => {
                    const info = getEstadoInfo(inscripcionSeleccionada.estado);
                    return (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        backgroundColor: info.bg,
                        color: info.color,
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}>
                        <info.icon size={20} />
                        {info.label}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estado Pago
                  </label>
                  {(() => {
                    const info = getPagoEstadoInfo(inscripcionSeleccionada.pago_estado);
                    return (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: info.color
                        }}>
                          {info.label}
                        </span>
                        {inscripcionSeleccionada.monto_pago > 0 && (
                          <span style={{
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <DollarSign size={18} />
                            ${inscripcionSeleccionada.monto_pago.toLocaleString()}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Fecha Inscripción */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fecha de Inscripción
                </label>
                <p style={{ fontSize: '1rem', color: '#1f2937', fontWeight: '500', margin: 0 }}>
                  {new Date(inscripcionSeleccionada.fecha_inscripcion).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Información Adicional */}
              {inscripcionSeleccionada.estado === 'pendiente' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <AlertCircle size={24} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontWeight: '600', color: '#92400e', margin: 0, marginBottom: '4px' }}>
                        Acción Requerida
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#78350f', margin: 0 }}>
                        Esta inscripción está pendiente de confirmación. Verifica el pago y confirma la inscripción.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                {inscripcionSeleccionada.estado === 'pendiente' && (
                  <button
                    onClick={() => {
                      handleConfirmar(inscripcionSeleccionada.id);
                      setModalDetalle(false);
                    }}
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
                    <CheckCircle size={18} />
                    Confirmar Inscripción
                  </button>
                )}
                {inscripcionSeleccionada.estado !== 'cancelada' && (
                  <button
                    onClick={() => {
                      handleCancelar(inscripcionSeleccionada.id);
                      setModalDetalle(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #ef4444',
                      background: 'white',
                      color: '#ef4444',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                )}
                <button
                  onClick={() => setModalDetalle(false)}
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
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <option value="1">Juan Pérez - juan@usc.edu.co</option>
                    <option value="2">María García - maria@usc.edu.co</option>
                    <option value="3">Carlos López - carlos@usc.edu.co</option>
                    <option value="4">Ana Martínez - ana@usc.edu.co</option>
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
                    <option value="1">Hackathon USC 2024 - 25 Dic 2024</option>
                    <option value="2">Conferencia IA - 28 Dic 2024</option>
                    <option value="3">Workshop React - 30 Dic 2024</option>
                    <option value="4">Feria Empresarial - 05 Ene 2025</option>
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