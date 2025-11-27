import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';

const CambiarPassword = () => {
  const navigate = useNavigate();
  
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmar: ''
  });

  const togglePassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.passwordNuevo.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.passwordNuevo !== formData.passwordConfirmar) {
      setError('Las contraseñas nuevas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.passwordActual === formData.passwordNuevo) {
      setError('La nueva contraseña debe ser diferente a la actual');
      setLoading(false);
      return;
    }

    try {
      await authAPI.cambiarPassword({
        passwordActual: formData.passwordActual,
        passwordNuevo: formData.passwordNuevo
      });

      setSuccess('¡Contraseña actualizada exitosamente!');
      
      setTimeout(() => {
        navigate('/dashboard'); // O la ruta que prefieras
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      const mensajeError = err.response?.data?.mensaje || 
                          err.response?.data?.error || 
                          'Error al cambiar la contraseña';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '480px',
        width: '100%'
      }}>
        {/* Header */}
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
            <ShieldCheck size={42} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Cambiar Contraseña
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Actualiza tu contraseña de forma segura
          </p>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '24px',
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
          Volver
        </button>

        {/* Mensajes */}
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
            gap: '10px'
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
            gap: '10px'
          }}>
            <CheckCircle size={20} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Contraseña Actual */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Contraseña Actual *
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
                type={showPasswords.actual ? 'text' : 'password'}
                name="passwordActual"
                required
                value={formData.passwordActual}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
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
                onClick={() => togglePassword('actual')}
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
                {showPasswords.actual ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div style={{ marginBottom: '20px' }}>
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
                type={showPasswords.nuevo ? 'text' : 'password'}
                name="passwordNuevo"
                required
                value={formData.passwordNuevo}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
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
                onClick={() => togglePassword('nuevo')}
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
                {showPasswords.nuevo ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Confirmar Nueva Contraseña *
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
                type={showPasswords.confirmar ? 'text' : 'password'}
                name="passwordConfirmar"
                required
                value={formData.passwordConfirmar}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
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
                onClick={() => togglePassword('confirmar')}
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
                {showPasswords.confirmar ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Indicador de fortaleza */}
          {formData.passwordNuevo && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
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
                  💡 {formData.passwordNuevo.length >= 8 
                    ? 'Contraseña fuerte' 
                    : 'Usa al menos 8 caracteres para mayor seguridad'}
                </p>
              </div>
            </div>
          )}

          {/* Botón submit */}
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
                Actualizando...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Cambiar Contraseña
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CambiarPassword;