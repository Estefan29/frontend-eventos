import { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, CreditCard, CheckCircle, Clock, XCircle, AlertCircle, Download, Eye, Plus, X } from 'lucide-react';
import Card from '../components/common/Card';
import { pagosAPI } from '../services/api';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroMetodo, setFiltroMetodo] = useState('todos');
  const [modalDetalle, setModalDetalle] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  useEffect(() => {
    cargarPagos();
  }, [filtroEstado, filtroMetodo]);

  const cargarPagos = async () => {
    try {
      const params = {};
      if (filtroEstado !== 'todos') params.estado = filtroEstado;
      if (filtroMetodo !== 'todos') params.metodo_pago = filtroMetodo;
      
      const response = await pagosAPI.obtenerTodos(params);
      setPagos(response.data || []);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (pago) => {
    setPagoSeleccionado(pago);
    setModalDetalle(true);
  };

  const pagosFiltrados = pagos.filter(pago =>
    pago.id?.toString().includes(busqueda) ||
    pago.referencia_pago?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoInfo = (estado) => {
    const estados = {
      pendiente: { color: '#fbbf24', bg: '#fef3c7', icon: Clock, label: 'Pendiente' },
      completado: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: 'Completado' },
      fallido: { color: '#ef4444', bg: '#fee2e2', icon: XCircle, label: 'Fallido' },
      reembolsado: { color: '#6366f1', bg: '#e0e7ff', icon: AlertCircle, label: 'Reembolsado' }
    };
    return estados[estado] || estados.pendiente;
  };

  const getMetodoInfo = (metodo) => {
    const metodos = {
      tarjeta: { icon: CreditCard, label: 'Tarjeta', color: '#3b82f6' },
      efectivo: { icon: DollarSign, label: 'Efectivo', color: '#10b981' },
      transferencia: { icon: CreditCard, label: 'Transferencia', color: '#8b5cf6' },
      pse: { icon: CreditCard, label: 'PSE', color: '#f59e0b' }
    };
    return metodos[metodo] || metodos.efectivo;
  };

  const stats = {
    total: pagos.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0),
    completados: pagos.filter(p => p.estado === 'completado').length,
    pendientes: pagos.filter(p => p.estado === 'pendiente').length,
    fallidos: pagos.filter(p => p.estado === 'fallido').length
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
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
            Gestión de Pagos
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Administra todas las transacciones y pagos
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Download size={20} />
          Exportar Reporte
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <Card hover={false} style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <DollarSign size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '4px' }}>Ingresos Totales</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                ${stats.total.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Pagos Completados</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.completados}</p>
            <CheckCircle size={32} color="#10b981" />
          </div>
        </Card>

        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Pendientes</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.pendientes}</p>
            <Clock size={32} color="#fbbf24" />
          </div>
        </Card>

        <Card hover={false}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Fallidos</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.fallidos}</p>
            <XCircle size={32} color="#ef4444" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              color="#9ca3af"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Buscar por ID o referencia..."
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

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '0.875rem' }}>Estado:</span>
            {['todos', 'completado', 'pendiente', 'fallido', 'reembolsado'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
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

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '0.875rem' }}>Método:</span>
            {['todos', 'tarjeta', 'efectivo', 'transferencia', 'pse'].map(metodo => (
              <button
                key={metodo}
                onClick={() => setFiltroMetodo(metodo)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filtroMetodo === metodo ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
                  color: filtroMetodo === metodo ? 'white' : '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem'
                }}
                onMouseOver={(e) => {
                  if (filtroMetodo !== metodo) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  if (filtroMetodo !== metodo) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
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
              borderTopColor: '#10b981',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando pagos...</p>
          </div>
        ) : pagosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <DollarSign size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {busqueda ? 'No se encontraron pagos' : 'No hay pagos registrados'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Monto</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Método</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Referencia</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((pago) => {
                  const estadoInfo = getEstadoInfo(pago.estado);
                  const metodoInfo = getMetodoInfo(pago.metodo_pago);
                  
                  return (
                    <tr
                      key={pago.id}
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
                          #{pago.id}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#10b981'
                        }}>
                          ${parseFloat(pago.monto || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: `${metodoInfo.color}15`,
                          color: metodoInfo.color,
                          fontWeight: '500',
                          fontSize: '0.875rem'
                        }}>
                          <metodoInfo.icon size={16} />
                          {metodoInfo.label}
                        </div>
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
                      <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(pago.fecha_pago).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          {pago.referencia_pago || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => verDetalle(pago)}
                            style={{
                              padding: '8px 16px',
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
                              gap: '6px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                          >
                            <Eye size={16} />
                            Ver
                          </button>
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
      {modalDetalle && pagoSeleccionado && (
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px 20px 0 0',
              color: 'white'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                  Detalle del Pago
                </h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                  ID: #{pagoSeleccionado.id}
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
              {/* Monto Principal */}
              <div style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                marginBottom: '24px',
                border: '2px solid #bbf7d0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Monto Total</p>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                  ${parseFloat(pagoSeleccionado.monto || 0).toLocaleString()}
                </p>
              </div>

              {/* Información */}
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estado
                  </label>
                  <div>
                    {(() => {
                      const info = getEstadoInfo(pagoSeleccionado.estado);
                      return (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          backgroundColor: info.bg,
                          color: info.color,
                          fontWeight: '600'
                        }}>
                          <info.icon size={20} />
                          {info.label}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Método de Pago
                  </label>
                  <div>
                    {(() => {
                      const info = getMetodoInfo(pagoSeleccionado.metodo_pago);
                      return (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          backgroundColor: `${info.color}15`,
                          color: info.color,
                          fontWeight: '600'
                        }}>
                          <info.icon size={20} />
                          {info.label}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Fecha de Pago
                  </label>
                  <p style={{ fontSize: '1rem', color: '#1f2937', fontWeight: '500', margin: 0 }}>
                    {new Date(pagoSeleccionado.fecha_pago).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {pagoSeleccionado.referencia_pago && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Referencia
                    </label>
                    <p style={{
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      color: '#1f2937',
                      padding: '12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      margin: 0
                    }}>
                      {pagoSeleccionado.referencia_pago}
                    </p>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ID Inscripción
                  </label>
                  <p style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: '#1f2937',
                    fontWeight: '500',
                    margin: 0
                  }}>
                    #{pagoSeleccionado.id_inscripcion}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Download size={18} />
                  Descargar Recibo
                </button>
                <button
                  onClick={() => setModalDetalle(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
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
                  Cerrar
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

export default Pagos;