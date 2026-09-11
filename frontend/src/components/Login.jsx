import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
    setSuccess('')
  }

  const switchMode = () => {
    setIsRegistering(!isRegistering)
    resetForm()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isRegistering) {
        const response = await fetch(`${API_URL}/users/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed')
        }

        setSuccess('Registration successful! Please login.')

        setUsername('')
        setEmail('')
        setPassword('')

        setTimeout(() => {
          setIsRegistering(false)
          setSuccess('')
        }, 1500)
      } else {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed')
        }

        localStorage.setItem('access_token', data.access_token)

        onLoginSuccess(data.access_token)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>

        <p>
          {isRegistering
            ? 'Create your Sports Injury Risk Detection account.'
            : 'Login to your Sports Injury Risk Detection account.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {success && <p className="success-message">{success}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? isRegistering
                ? 'Creating Account...'
                : 'Logging in...'
              : isRegistering
                ? 'Register'
                : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={switchMode}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={switchMode}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login