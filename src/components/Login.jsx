import { useState } from 'react'
import { login, errorMessage } from '../api'

export default function Login({ onSuccess, onError }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      onError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      await login(username, password)
      onSuccess()
    } catch (err) {
      onError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card">
      <h2>Account Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            autoComplete="off"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
