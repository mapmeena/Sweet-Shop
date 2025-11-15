import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

interface LoginProps {
  onSwitchToRegister: () => void
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await login(email, password)
    } catch {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-icon">🍬</div>
          <h1 className="auth-title">Sweet Haven</h1>
          <p className="auth-subtitle">Welcome back to sweetness!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message fade-in">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In 🎉
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToRegister}
            >
              Sign up for free
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">✨ Demo Credentials</p>
          <div className="demo-grid">
            <div className="demo-item">
              <span className="demo-label">Admin:</span>
              <span className="demo-value">admin@sweetshop.com</span>
            </div>
            <div className="demo-item">
              <span className="demo-label">User:</span>
              <span className="demo-value">user@sweetshop.com</span>
            </div>
          </div>
          <p className="demo-note">Password: password123</p>
        </div>
      </div>
    </div>
  )
}
