import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ serverStatus }) => {
  const { user, logout } = useAuth()

  return (
    <nav style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            margin: 0
          }}>
            socioMAC
          </h1>
          <span style={{
            padding: '2px 8px',
            background: serverStatus === 'online' ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.75rem'
          }}>
            {serverStatus === 'online' ? '🟢' : '🔴'}
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/" style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#374151'
              }}>Home</Link>
              <Link to="/chat" style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#374151'
              }}>Chat</Link>
              <Link to="/stories" style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#374151'
              }}>Stories</Link>
              <Link to="/profile" style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#374151'
              }}>Profile</Link>
              <button onClick={logout} style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#374151'
              }}>Login</Link>
              <Link to="/register" style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px'
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
