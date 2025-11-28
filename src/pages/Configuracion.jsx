import { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, Mail, Phone, Save, Camera, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';

const Configuracion = () => {
  const { usuario, actualizarUsuario } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [perfilData, setPerfilData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    carrera: ''
  });

  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmar: ''
  });

  const [notificaciones, setNotificaciones] = useState({
    emailEventos: true,
    emailInscripciones: true,
    emailPagos: true,
    pushNotificaciones: false
  });

  // 🔄 Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (usuario) {
      setPerfilData({
        nombre: usuario.nombre || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        carrera: usuario.carrera || ''
      });
    }
  }, [usuario]);

  // ✅ Guardar cambios de perfil
  const handleGuardarPerfil = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.actualizarPerfil({
        nombre: perfilData.nombre,
        telefono: perfilData.telefono,
        carrera: perfilData.carrera
      });

      console.log('✅ Perfil actualizado:', response.data);

      // Actualizar el usuario en el store
      if (response.data.usuario) {
        actualizarUsuario(response.data.usuario);
      }

      setSuccess('¡Perfil actualizado exitosamente!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(err.response?.data?.mensaje || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Cambiar contraseña
  const handleCambiarPassword = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (!passwordData.passwordActual || !passwordData.passwordNuevo || !passwordData.confirmar) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (passwordData.passwordNuevo.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.passwordNuevo !== passwordData.confirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await authAPI.cambiarPassword({
        passwordActual: passwordData.passwordActual,
        passwordNuevo: passwordData.passwordNuevo
      });

      setSuccess('¡Contraseña cambiada exitosamente!');
      setPasswordData({ passwordActual: '', passwordNuevo: '', confirmar: '' });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error al cambiar contraseña:', err);
      setError(err.response?.data?.mensaje || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: Lock },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'privacidad', label: 'Privacidad', icon: Shield }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Configuración
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Gestiona tu perfil y preferencias
        </p>
      </div>

      {/* Mensajes de Error/Éxito */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px solid #fecaca',
          color: '#dc2626',
          padding: '14px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'shake 0.5s'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '2px solid #a7f3d0',
          color: '#065f46',
          padding: '14px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideDown 0.5s'
        }}>
          <CheckCircle size={20} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Tabs Sidebar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError('');
                  setSuccess('');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* PERFIL */}
          {activeTab === 'perfil' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
                Información Personal
              </h2>

              {/* Foto de Perfil */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}>
                  {perfilData.nombre ? perfilData.nombre.charAt(0).toUpperCase() : usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <button
                    onClick={() => alert('Función de cambio de foto próximamente')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}
                  >
                    <Camera size={18} />
                    Cambiar Foto
                  </button>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    JPG, PNG o GIF (máx. 2MB)
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={perfilData.nombre}
                      onChange={(e) => setPerfilData({...perfilData, nombre: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Correo Electrónico
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        value={perfilData.correo}
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 44px',
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      El correo no se puede modificar
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                      Teléfono
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        value={perfilData.telefono}
                        onChange={(e) => setPerfilData({...perfilData, telefono: e.target.value})}
                        placeholder="Ej: 3001234567"
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 44px',
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Carrera/Programa
                  </label>
                  <input
                    type="text"
                    value={perfilData.carrera}
                    onChange={(e) => setPerfilData({...perfilData, carrera: e.target.value})}
                    placeholder="Ej: Ingeniería de Sistemas"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#1e40af',
                    margin: 0
                  }}>
                    ℹ️ <strong>Rol actual:</strong> {usuario?.rol || 'No especificado'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGuardarPerfil}
                disabled={loading}
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Save size={18} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {/* SEGURIDAD */}
          {activeTab === 'seguridad' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
                Cambiar Contraseña
              </h2>

              <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Contraseña Actual
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.passwordActual}
                      onChange={(e) => setPasswordData({...passwordData, passwordActual: e.target.value})}
                      placeholder="Ingresa tu contraseña actual"
                      style={{
                        width: '100%',
                        padding: '12px 48px 12px 44px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Nueva Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.passwordNuevo}
                      onChange={(e) => setPasswordData({...passwordData, passwordNuevo: e.target.value})}
                      placeholder="Mínimo 6 caracteres"
                      style={{
                        width: '100%',
                        padding: '12px 48px 12px 44px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Confirmar Nueva Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      value={passwordData.confirmar}
                      onChange={(e) => setPasswordData({...passwordData, confirmar: e.target.value})}
                      placeholder="Confirma la nueva contraseña"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCambiarPassword}
                disabled={loading}
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Lock size={18} />
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          )}

          {/* NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
                Preferencias de Notificaciones
              </h2>

              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  { key: 'emailEventos', label: 'Nuevos eventos disponibles', desc: 'Recibe un correo cuando se publiquen nuevos eventos' },
                  { key: 'emailInscripciones', label: 'Confirmaciones de inscripción', desc: 'Notificaciones sobre tus inscripciones a eventos' },
                  { key: 'emailPagos', label: 'Confirmaciones de pago', desc: 'Recibe confirmación de tus transacciones' },
                  { key: 'pushNotificaciones', label: 'Notificaciones Push', desc: 'Alertas en tiempo real en tu navegador' }
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#bfdbfe'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>{item.label}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={notificaciones[item.key]}
                        onChange={(e) => setNotificaciones({...notificaciones, [item.key]: e.target.checked})}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: notificaciones[item.key] ? '#2563eb' : '#e5e7eb',
                        transition: '0.3s',
                        borderRadius: '28px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '20px',
                          width: '20px',
                          left: notificaciones[item.key] ? '28px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.3s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSuccess('Preferencias de notificaciones guardadas');
                  setTimeout(() => setSuccess(''), 3000);
                }}
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Save size={18} />
                Guardar Preferencias
              </button>
            </div>
          )}

          {/* PRIVACIDAD */}
          {activeTab === 'privacidad' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
                Privacidad y Datos
              </h2>

              <div style={{
                padding: '20px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '2px solid #bfdbfe'
              }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>
                  🔒 Tus datos están protegidos
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  Usamos encriptación de extremo a extremo para proteger tu información personal.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <button
                  onClick={() => alert('Función de descarga de datos próximamente')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  📄 Descargar mis datos
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                      alert('Función de eliminación de cuenta próximamente');
                    }
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #fee2e2',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#fecaca';
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#fee2e2';
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                >
                  🗑️ Eliminar mi cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Configuracion;