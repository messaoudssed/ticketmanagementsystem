import React, { useState } from 'react'

export default function TicketForm({ onCreate }) {
  const [form, setForm] = useState({ title:'', description:'', deadline:'', priority:3 })
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); onCreate?.(form); setForm({ title:'', description:'', deadline:'', priority:3 }) }
  return (
    <form onSubmit={submit} className="card" style={{ display:'grid', gap:10, marginBottom:16 }}>
      <h3>Create Ticket</h3>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} rows={3} />
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input type="date" name="deadline" value={form.deadline} onChange={onChange} />
        <select name="priority" value={form.priority} onChange={onChange}>
          <option value={1}>Priority 1 (High)</option>
          <option value={2}>Priority 2</option>
          <option value={3}>Priority 3</option>
          <option value={4}>Priority 4</option>
          <option value={5}>Priority 5 (Low)</option>
        </select>
      </div>
      <button className="primary" type="submit">Add Ticket</button>
    </form>
  )
}
