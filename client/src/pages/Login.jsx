import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [identifier, setIdentifier] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { identifier, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card" style={{ maxWidth:520, margin:'40px auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Email or Username" value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="primary" type="submit">Login</button>
      </form>
    </div>
  )
}
