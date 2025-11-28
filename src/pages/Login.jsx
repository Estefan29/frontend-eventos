import { useState } from 'react';
import { Calendar, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, GraduationCap, Users, Globe } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';

const Login = () => {
  const { login } = useAuthStore();
  
  const [vista, setVista] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'estudiante'
  });

  // 🎓 Roles permitidos para registro público
  const rolesPublicos = [
    { 
      valor: 'estudiante', 
      label: 'Estudiante USC',
      descripcion: 'Estudiante activo de la universidad',
      icon: GraduationCap,
      color: '#3b82f6'
    },
    { 
      valor: 'profesor', 
      label: 'Docente',
      descripcion: 'Profesor o docente de la universidad',
      icon: Users,
      color: '#8b5cf6'
    },
    { 
      valor: 'externo', 
      label: 'Externo',
      descripcion: 'Persona externa a la universidad',
      icon: Globe,
      color: '#10b981'
    }
  ];

  // ✅ VALIDACIÓN DE CORREO MÁS FLEXIBLE
  const validarCorreoBasico = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (vista === 'login') {
        // ✅ VALIDACIÓN BÁSICA
        if (!formData.correo || !formData.password) {
          throw new Error('Por favor completa todos los campos');
        }

        if (!validarCorreoBasico(formData.correo)) {
          throw new Error('Por favor ingresa un correo válido');
        }

        console.log('📤 Enviando login:', {
          correo: formData.correo,
          password: '***'
        });

        // ✅ ENVIAR LOGIN
        const response = await authAPI.login({
          correo: formData.correo.trim().toLowerCase(),
          password: formData.password
        });

        console.log('📥 Respuesta login:', response.data);

        // ✅ EXTRAER DATOS DE LA RESPUESTA
        const { usuario, token } = response.data;
        
        if (!usuario || !token) {
          throw new Error('Error en la respuesta del servidor');
        }

        console.log('✅ Usuario logueado:', usuario);
        console.log('🔑 Token recibido:', token.substring(0, 20) + '...');

        // ✅ GUARDAR EN STORE Y LOCALSTORAGE
        login(usuario, token);
        
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        
        // ✅ REDIRIGIR AL DASHBOARD
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
        
      } else if (vista === 'registro') {
        // ✅ VALIDACIONES DE REGISTRO
        if (!formData.nombre || formData.nombre.length < 3) {
          throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (!validarCorreoBasico(formData.correo)) {
          throw new Error('Por favor ingresa un correo válido');
        }

        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        
        if (!rolesPublicos.some(r => r.valor === formData.rol)) {
          throw new Error('Rol no válido');
        }

        console.log('📤 Enviando registro:', {
          nombre: formData.nombre,
          correo: formData.correo,
          rol: formData.rol
        });
        
        await authAPI.registro({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim().toLowerCase(),
          password: formData.password,
          rol: formData.rol
        });
        
        setSuccess('¡Cuenta creada exitosamente! Inicia sesión para continuar.');
        
        setTimeout(() => {
          setVista('login');
          setSuccess('');
          setFormData({
            nombre: '',
            correo: '',
            password: '',
            rol: 'estudiante'
          });
        }, 2000);
        
      } else if (vista === 'recuperar') {
        if (!validarCorreoBasico(formData.correo)) {
          throw new Error('Por favor ingresa un correo válido');
        }

        await authAPI.recuperarPassword(formData.correo.trim().toLowerCase());
        
        setSuccess('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
        
        setTimeout(() => {
          setVista('login');
          setSuccess('');
          setFormData({
            nombre: '',
            correo: '',
            password: '',
            rol: 'estudiante'
          });
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('📋 Response data:', err.response?.data);
      
      const mensajeError = err.response?.data?.mensaje || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al procesar la solicitud';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: '#60a5fa',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: '#93c5fd',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'pulse 6s ease-in-out infinite'
        }}></div>
      </div>

      {/* Login Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '48px',
        maxWidth: vista === 'registro' ? '520px' : '440px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.5s ease-out'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
            transform: 'rotate(-3deg)',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(3deg) scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(-3deg) scale(1)'}
          >
            <Calendar size={42} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Eventos USC
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            {vista === 'login' && 'Inicia sesión en tu cuenta'}
            {vista === 'registro' && 'Crea tu cuenta'}
            {vista === 'recuperar' && 'Recupera tu contraseña'}
          </p>
        </div>

        {/* Botón de regresar */}
        {vista !== 'login' && (
          <button
            onClick={() => {
              setVista('login');
              setError('');
              setSuccess('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '20px',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ArrowLeft size={18} />
            Volver al inicio de sesión
          </button>
        )}

        {/* Error Message */}
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

        {/* Success Message */}
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

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {/* Nombre (solo en registro) */}
          {vista === 'registro' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Nombre completo *
              </label>
              <div style={{ position: 'relative' }}>
                <User 
                  size={20} 
                  color="#9ca3af" 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                  }} 
                />
                <input
                  type="text"
                  name="nombre"
                  required={vista === 'registro'}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Correo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Correo electrónico *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={20} 
                color="#9ca3af" 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                }} 
              />
              <input
                type="email"
                name="correo"
                required
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@correo.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Contraseña (no en recuperar) */}
          {vista !== 'recuperar' && (
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={20} 
                  color="#9ca3af" 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                  }} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 44px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </button>
              </div>
            </div>
          )}

          {/* ¿Olvidaste tu contraseña? */}
          {vista === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setVista('recuperar');
                  setFormData({ ...formData, password: '' });
                }}
                style={{
                  color: '#2563eb',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {/* 🎓 Selector de Rol (solo en registro) */}
          {vista === 'registro' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Tipo de usuario *
              </label>
              <div style={{ display: 'grid', gap: '12px' }}>
                {rolesPublicos.map((rol) => {
                  const IconComponent = rol.icon;
                  const isSelected = formData.rol === rol.valor;
                  
                  return (
                    <button
                      key={rol.valor}
                      type="button"
                      onClick={() => setFormData({...formData, rol: rol.valor})}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? rol.color : '#e5e7eb'}`,
                        backgroundColor: isSelected ? `${rol.color}10` : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        width: '100%'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = rol.color;
                          e.currentTarget.style.backgroundColor = `${rol.color}05`;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? rol.color : `${rol.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={24} color={isSelected ? 'white' : rol.color} />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontWeight: '600',
                          color: isSelected ? rol.color : '#1f2937',
                          marginBottom: '4px',
                          fontSize: '0.95rem'
                        }}>
                          {rol.label}
                        </p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {rol.descripcion}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: rol.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <CheckCircle size={16} color="white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#1e40af',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ℹ️ Los permisos de <strong>Administrador</strong> son asignados por el sistema
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Procesando...
              </>
            ) : (
              <>
                {vista === 'login' && 'Iniciar Sesión'}
                {vista === 'registro' && 'Crear Cuenta'}
                {vista === 'recuperar' && 'Enviar Enlace'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          {vista === 'login' ? (
            <>
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => {
                  setVista('registro');
                  setError('');
                  setSuccess('');
                }}
                style={{
                  color: '#2563eb',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Regístrate aquí
              </button>
            </>
          ) : vista === 'registro' ? (
            <>
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => {
                  setVista('login');
                  setError('');
                  setSuccess('');
                }}
                style={{
                  color: '#2563eb',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Inicia sesión
              </button>
            </>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Login;