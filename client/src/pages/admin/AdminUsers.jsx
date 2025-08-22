import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminUsers() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [limit] = useState(10)
  const [error, setError] = useState('')

  const load = async (p = page) => {
    try {
      const params = new URLSearchParams({ page: p, limit })
      if (q) params.set('q', q)
      if (role) params.set('role', role)
      const { data } = await api.get(`/admin/users?${params}`)
      setItems(data.items); setPage(data.page); setPages(data.pages)
    } catch (e) { setError(e?.response?.data?.message || 'Failed to load users') }
  }

  const create = async () => {
    const name = prompt('Name?'), username = prompt('Username?'), email = prompt('Email?'), password = prompt('Temp password?'), role = prompt('Role? (user/tech/admin)')
    if (!username || !email || !password) return
    await api.post('/admin/users', { name, username, email, password, role })
    await load()
  }

  const setRoleOf = async (id) => {
    const r = prompt('New role? (user/tech/admin)')
    if (!r) return
    await api.patch(`/admin/users/${id}`, { role: r })
    await load()
  }

  const toggleActive = async (u) => {
    await api.patch(`/admin/users/${u._id}`, { isActive: !u.isActive })
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Delete user?')) return
    await api.delete(`/admin/users/${id}`)
    await load()
  }

  useEffect(()=>{ load(1) }, [])

  return (
    <div>
      <h2>Admin · Users</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <div className="card" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <input placeholder="Search name/username/email" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="user">user</option>
          <option value="tech">tech</option>
          <option value="admin">admin</option>
        </select>
        <button className="primary" onClick={()=>load(1)}>Apply</button>
        <div style={{ flex: 1 }} />
        <button onClick={create}>+ Create User</button>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(u => (
              <tr key={u._id}>
                <td>{u.name || '-'}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{String(u.isActive)}</td>
                <td style={{ whiteSpace:'nowrap' }}>
                  <button onClick={()=>setRoleOf(u._id)}>Change role</button>{' '}
                  <button onClick={()=>toggleActive(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button>{' '}
                  <button onClick={()=>remove(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6">No users.</td></tr>}
          </tbody>
        </table>
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button disabled={page>=pages} onClick={()=>load(page+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
