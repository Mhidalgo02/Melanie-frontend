import { useState } from 'react'
import { login, errorMessage } from '../api'

export default function Login({ onSuccess, onError }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <form className="card login" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  )
}