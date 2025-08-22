import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [form, setForm] = useState({ name:'', username:'', email:'', password:'', role:'user' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', form)
      setMsg('Registered successfully. You can login now.')
      setErr('')
      setTimeout(()=>navigate('/login'), 600)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed')
      setMsg('')
    }
  }

  return (
    <div className="card" style={{ maxWidth:560, margin:'40px auto' }}>
      <h2>Register</h2>
      {msg && <p style={{color:'limegreen'}}>{msg}</p>}
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
        <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">user</option>
          <option value="tech">tech</option>
          <option value="admin">admin</option>
        </select>
        <button className="primary" type="submit">Create account</button>
      </form>
    </div>
  )
}
