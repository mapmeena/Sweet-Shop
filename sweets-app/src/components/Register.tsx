import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

interface RegisterProps {
  onSwitchToLogin: () => void
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const { register, isLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await register(username, email, password)
    } catch {
      setError('Registration failed. Email may already be in use.')
    }
  }

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, text: '', color: '' }
    if (pass.length < 6) return { strength: 1, text: 'Weak', color: '#f44336' }
    if (pass.length < 10) return { strength: 2, text: 'Medium', color: '#ff9800' }
    return { strength: 3, text: 'Strong', color: '#4caf50' }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-icon">🍬</div>
          <h1 className="auth-title">Sweet Haven</h1>
          <p className="auth-subtitle">Join our sweet community!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              className="form-input"
              disabled={isLoading}
              autoComplete="username"
            />
            {username && username.length < 3 && (
              <span className="input-hint">Minimum 3 characters</span>
            )}
          </div>

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
            <span className="input-hint">
              💡 Use 'admin' in email for admin access
            </span>
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
                placeholder="Enter a strong password"
                className="form-input"
                disabled={isLoading}
                autoComplete="new-password"
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
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(passwordStrength.strength / 3) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-text"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="form-input"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span className="input-error">❌ Passwords don't match</span>
            )}
            {confirmPassword && password === confirmPassword && (
              <span className="input-success">✅ Passwords match</span>
            )}
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
                Creating account...
              </>
            ) : (
              <>
                Create Account 🎉
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToLogin}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
