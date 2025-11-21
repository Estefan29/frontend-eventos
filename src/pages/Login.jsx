import { useState } from 'react';
import { Calendar, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [vista, setVista] = useState('login'); // 'login', 'registro', 'recuperar'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailValido, setEmailValido] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'estudiante'
  });

  // Validar si el correo existe (verificación DNS)
  const validarCorreoReal = async (email) => {
    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Lista de dominios comunes válidos (puedes expandirla)
    const dominiosValidos = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
      'usc.edu.co', 'estudiantes.usc.edu.co', 'icloud.com',
      'live.com', 'msn.com', 'protonmail.com'
    ];

    const dominio = email.split('@')[1]?.toLowerCase();
    
    // Verificar si el dominio está en la lista de válidos
    const dominioValido = dominiosValidos.some(d => dominio === d || dominio?.endsWith(d));
    
    // Validar dominios obviamente falsos
    const dominiosInvalidos = ['test.com', 'fake.com', 'example.com', 'prueba.com', 'temporal.com'];
    const esDominioInvalido = dominiosInvalidos.some(d => dominio?.includes(d));

    if (esDominioInvalido) {
      return false;
    }

    // Si tiene un dominio válido conocido o parece legítimo
    return dominioValido || dominio?.includes('.');
  };

  const handleEmailBlur = async () => {
    if (formData.correo) {
      const esValido = await validarCorreoReal(formData.correo);
      setEmailValido(esValido);
      if (!esValido) {
        setError('Por favor ingresa un correo electrónico válido y real');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar correo antes de enviar
    if (vista === 'registro' || vista === 'recuperar') {
      const esValido = await validarCorreoReal(formData.correo);
      if (!esValido) {
        setError('Por favor ingresa un correo electrónico válido y existente');
        setLoading(false);
        return;
      }
    }

    try {
      if (vista === 'login') {
        // Simular login (reemplaza con tu API real)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simular respuesta exitosa
        console.log('Login exitoso:', formData);
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        
        // Aquí irá tu lógica real:
        // const response = await authAPI.login({
        //   correo: formData.correo,
        //   contraseña: formData.contraseña
        // });
        // login(response.data.usuario, response.data.token);
        
      } else if (vista === 'registro') {
        // Validaciones adicionales para registro
        if (formData.nombre.length < 3) {
          throw new Error('El nombre debe tener al menos 3 caracteres');
        }
        if (formData.contraseña.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        
        // Simular registro
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Registro exitoso:', formData);
        setSuccess('¡Cuenta creada exitosamente! Inicia sesión para continuar.');
        
        setTimeout(() => {
          setVista('login');
          setSuccess('');
        }, 2000);
        
        // Aquí irá tu lógica real:
        // const response = await authAPI.registro(formData);
        // login(response.data.usuario, response.data.token);
        
      } else if (vista === 'recuperar') {
        // Simular recuperación
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
        
        setTimeout(() => {
          setVista('login');
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al escribir
    if (error) setError('');
    if (name === 'correo' && !emailValido) setEmailValido(true);
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
        maxWidth: '440px',
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
        <div onSubmit={handleSubmit}>
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
                onBlur={handleEmailBlur}
                placeholder="tu@correo.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  border: `2px solid ${!emailValido && formData.correo ? '#ef4444' : '#e5e7eb'}`,
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (emailValido) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
              />
              {!emailValido && formData.correo && (
                <AlertCircle 
                  size={20} 
                  color="#ef4444" 
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                  }} 
                />
              )}
            </div>
            {!emailValido && formData.correo && (
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#ef4444', 
                marginTop: '6px',
                marginLeft: '4px'
              }}>
                Ingresa un correo electrónico válido y existente
              </p>
            )}
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
                  name="contraseña"
                  required
                  value={formData.contraseña}
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
              {vista === 'registro' && (
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '6px',
                  marginLeft: '4px'
                }}>
                  Mínimo 6 caracteres
                </p>
              )}
            </div>
          )}

          {/* ¿Olvidaste tu contraseña? (solo en login) */}
          {vista === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setVista('recuperar')}
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

          {/* Rol (solo en registro) */}
          {vista === 'registro' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="administrativo">Administrativo</option>
                <option value="externo">Externo</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || (!emailValido && formData.correo)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: loading || (!emailValido && formData.correo)
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading || (!emailValido && formData.correo) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!loading && emailValido) {
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
                {vista === 'recuperar' && 'Enviar Enlace de Recuperación'}
              </>
            )}
          </button>
        </div>

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