import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Stories from './pages/Stories'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [loading, setLoading] = useState(true)
  const [serverStatus, setServerStatus] = useState('checking')

  useEffect(() => {
    checkServer()
  }, [])

  const checkServer = async () => {
    try {
      await axios.get('/api/health')
      setServerStatus('online')
    } catch (error) {
      setServerStatus('offline')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar serverStatus={serverStatus} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/stories" element={<Stories />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App