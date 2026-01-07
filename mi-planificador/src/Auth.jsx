import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('¡Usuario creado! Revisa tu correo si tienes la confirmación activa.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">🚀</div>
          <h1 style={{ color: 'white', marginBottom: '10px' }}>
            {isRegistering ? 'Crear Cuenta' : '¡Bienvenido!'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Tu planificador personal inteligente
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ width: '100%' }}>
          <div className="input-field" style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.85rem' }}>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: 'white' }}
            />
          </div>

          <div className="input-field" style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.85rem' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: 'white' }}
            />
          </div>

          <button className="auth-btn" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <span 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate gratis'}
          </span>
        </p>
      </div>
    </div>
  )
}