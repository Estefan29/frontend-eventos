import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValido, setTokenValido] = useState(null);

  const [formData, setFormData] = useState({
    password: '',
    confirmarPassword: ''
  });

  // Validar token al cargar la página
  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setTokenValido(false);
        setError('Token no válido o expirado');
        return;
      }

      try {
        console.log('🔍 Validando token:', token);
        
        const response = await fetch(`http://localhost:4000/api/auth/validate-reset-token/${token}`);
        const data = await response.json();
        
        console.log('📥 Respuesta validación:', data);

        if (response.ok && data.valido) {
          setTokenValido(true);
          console.log('✅ Token válido');
        } else {
          setTokenValido(false);
          setError(data.mensaje || 'El enlace ha expirado o no es válido');
          console.log('❌ Token inválido');
        }
      } catch (err) {
        console.error('❌ Error validando token:', err);
        setTokenValido(false);
        setError('El enlace de recuperación ha expirado o no es válido');
      }
    };

    validarToken();
  }, [token]);

  const validarContraseña = () => {
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validarContraseña()) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Enviando nueva contraseña...');
      
      const response = await fetch(`http://localhost:4000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: formData.password 
        }),
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (response.ok) {
        setSuccess('¡Contraseña restablecida exitosamente!');
        console.log('✅ Contraseña actualizada');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al restablecer la contraseña');
        console.log('❌ Error:', data.mensaje);
      }
    } catch (err) {
      console.error('❌ Error al restablecer contraseña:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Si el token no es válido, mostrar mensaje de error
  if (tokenValido === false) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '48px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <AlertCircle size={42} color="white" />
          </div>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            Enlace no válido
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px',
            fontSize: '0.95rem'
          }}>
            {error || 'El enlace de recuperación ha expirado o no es válido. Por favor, solicita un nuevo enlace de recuperación.'}
          </p>
          
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={20} />
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras valida el token
  if (tokenValido === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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

      {/* Reset Password Card */}
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
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
          }}>
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
            Nueva Contraseña
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Ingresa tu nueva contraseña
          </p>
        </div>

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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Nueva Contraseña */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Nueva Contraseña *
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
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '6px'
            }}>
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Confirmar Contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Confirmar Contraseña *
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
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmarPassword"
                required
                value={formData.confirmarPassword}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: loading
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
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
              'Restablecer Contraseña'
            )}
          </button>
        </form>

        {/* Volver al login */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              color: '#2563eb',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: '0 auto'
            }}
          >
            <ArrowLeft size={16} />
            Volver al inicio de sesión
          </button>
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

export default ResetPassword;