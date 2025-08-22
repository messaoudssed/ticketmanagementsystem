import React,{useEffect,useState} from 'react'
import api from '../../services/api'
import UserForm from '../../components/UserForm'

export default function ManageUsers(){
  const [items,setItems]=useState([])
  const [q,setQ]=useState('')
  const [role,setRole]=useState('')
  const [page,setPage]=useState(1)
  const [pages,setPages]=useState(1)
  const [limit,setLimit]=useState(10)
  const [showCreate,setShowCreate]=useState(false)
  const [error,setError]=useState('')

  const load = async (p=page) => {
    try{
      const params = new URLSearchParams({ page:String(p), limit:String(limit) })
      if(q) params.set('q', q)
      if(role) params.set('role', role)
      const { data } = await api.get(`/admin/users?${params.toString()}`)
      setItems(data.items); setPage(data.page); setPages(data.pages)
    }catch(e){ setError(e?.response?.data?.message || 'Failed to load users') }
  }

  useEffect(()=>{ load(1) }, [q,role,limit])

  const createUser = async (form) => {
    await api.post('/admin/users', form); setShowCreate(false); load()
  }
  const changeRole = async (u) => {
    const r = prompt('New role? (user/tech/admin)', u.role); if(!r) return
    await api.patch(`/admin/users/${u._id}`, { role:r }); load()
  }
  const toggleActive = async (u) => { await api.patch(`/admin/users/${u._id}`, { isActive: !u.isActive }); load() }
  const remove = async (u) => { if(confirm('Delete user?')) { await api.delete(`/admin/users/${u._id}`); load() } }

  return (
    <div>
      <h2>Admin · Users</h2>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <div className="card" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <input placeholder="Search (name/username/email)" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="user">user</option>
          <option value="tech">tech</option>
          <option value="admin">admin</option>
        </select>
        <select value={limit} onChange={e=>setLimit(parseInt(e.target.value))}>
          <option>10</option><option>20</option><option>50</option>
        </select>
        <button className="primary" onClick={()=>load(1)}>Apply</button>
        <div style={{flex:1}} />
        <button onClick={()=>setShowCreate(v=>!v)}>{showCreate? 'Close' : '+ Create'}</button>
      </div>

      {showCreate && <UserForm onSubmit={createUser} />}

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(u => (
              <tr key={u._id}>
                <td>{u.name || '-'}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>{String(u.isActive)}</td>
                <td className="actions">
                  <button onClick={()=>changeRole(u)}>Change role</button>
                  <button onClick={()=>toggleActive(u)}>{u.isActive?'Deactivate':'Activate'}</button>
                  <button onClick={()=>remove(u)}>Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6">No users.</td></tr>}
          </tbody>
        </table>
        <div className="actions" style={{ marginTop:8 }}>
          <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button disabled={page>=pages} onClick={()=>load(page+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
