import { useState, useEffect } from 'react'
import { auth, logout, setSessionExpiredHandler } from './api'
import Login from './components/Login.jsx'
import ProductList from './components/ProductList.jsx'
import ProductForm from './components/ProductForm.jsx'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!auth.access)
  const [page, setPage] = useState('list')        // 'list' or 'form'
  const [editing, setEditing] = useState(null)    // product being edited (null = adding)
  const [message, setMessage] = useState(null)    // { type: 'success' | 'error', text }

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setLoggedIn(false)
      setMessage({ type: 'error', text: 'Session expired. Please log in again.' })
    })
  }, [])

  const showMessage = (type, text) => setMessage({ type, text })

  const handleLogout = async () => {
    try { await logout() } catch { /* token is cleared anyway */ }
    setLoggedIn(false)
    setPage('list')
    setEditing(null)
    showMessage('success', 'You have been logged out.')
  }

  if (!loggedIn) {
    return (
      <div className="container">
        {message && <div className={`alert ${message.type}`}>{message.text}</div>}
        <Login
          onSuccess={() => { setLoggedIn(true); setMessage(null) }}
          onError={(text) => showMessage('error', text)}
        />
      </div>
    )
  }

  return (
    <>
      <nav className="navbar">
        <strong>Product Management</strong>
        <div className="nav-links">
          <button className="link" onClick={() => { setPage('list'); setEditing(null) }}>Products</button>
          <button className="link" onClick={() => { setPage('form'); setEditing(null) }}>Add Product</button>
          <span className="user">{auth.username}</span>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        {message && <div className={`alert ${message.type}`}>{message.text}</div>}

        {page === 'list' ? (
          <ProductList
            onEdit={(p) => { setEditing(p); setPage('form'); setMessage(null) }}
            onMessage={showMessage}
          />
        ) : (
          <ProductForm
            product={editing}
            onDone={(text) => { showMessage('success', text); setEditing(null); setPage('list') }}
            onCancel={() => { setEditing(null); setPage('list') }}
          />
        )}
      </div>
    </>
  )
}