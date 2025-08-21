import React, { useState } from 'react'

export default function TicketForm({ onCreate }) {
  const [form, setForm] = useState({ title:'', description:'', deadline:'' })
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); onCreate?.(form); setForm({ title:'', description:'', deadline:'' }) }
  return (
    <form onSubmit={submit} className="card" style={{ display:'grid', gap:10, marginBottom:16 }}>
      <h3>Create Ticket</h3>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} rows={3} />
      <input type="date" name="deadline" value={form.deadline} onChange={onChange} />
      <button className="primary" type="submit">Add Ticket</button>
    </form>
  )
}
