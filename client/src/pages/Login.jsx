import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [identifier, setIdentifier] = useState('bob@example.com')
  const [password, setPassword] = useState('Secret123')
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('Bob')
  const [username, setUsername] = useState('bob')
  const [email, setEmail] = useState('bob@example.com')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { identifier, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.user.name || data.user.username)
      navigate('/tickets')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { name, username, email, password })
      const { data } = await api.post('/auth/login', { identifier: email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.user.name || data.user.username)
      navigate('/tickets')
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} style={{ display:'grid', gap:10 }}>
          <input placeholder="Email or Username" value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="primary" type="submit">Login</button>
          <button type="button" onClick={()=>setMode('register')}>Create an account</button>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ display:'grid', gap:10 }}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="primary" type="submit">Register & Login</button>
          <button type="button" onClick={()=>setMode('login')}>Back to login</button>
        </form>
      )}
    </div>
  )
}
