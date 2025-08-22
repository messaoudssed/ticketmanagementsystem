import React, { useState } from 'react'

export default function UserForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { name:'', username:'', email:'', password:'', role:'user' })
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.(form)}} className="card" style={{ display:'grid', gap:8 }}>
      <h3>{initial ? 'Edit User' : 'Create User'}</h3>
      <div>
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      </div>
      <div>
        <label>Username</label>
        <input required value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      </div>
      {!initial && (
        <div>
          <label>Password</label>
          <input type="password" required value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        </div>
      )}
      <div>
        <label>Role</label>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">user</option>
          <option value="tech">tech</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div className="actions">
        <button className="primary" type="submit">{initial ? 'Save' : 'Create'}</button>
      </div>
    </form>
  )
}
