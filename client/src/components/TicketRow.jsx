import React, { useState } from 'react'

export default function TicketRow({ t, onSave, onDelete }) {
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    title: t.title, description: t.description || '', deadline: t.deadline?.slice(0,10) || '',
    status: t.status || 'not_addressed', assigneeName: t.assigneeName || ''
  })
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async () => { await onSave?.(t._id, form); setEdit(false) }
  const remove = async () => { if (confirm('Delete this ticket?')) await onDelete?.(t._id) }

  if (!edit) {
    return (
      <tr>
        <td>{t.title}</td>
        <td><span className={`status ${t.status}`}>{t.status}</span></td>
        <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : '-'}</td>
        <td style={{ whiteSpace:'nowrap' }}>
          <button onClick={()=>setEdit(true)}>Edit</button>{' '}
          <button onClick={remove}>Delete</button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td><input name="title" value={form.title} onChange={onChange} required /></td>
      <td>
        <select name="status" value={form.status} onChange={onChange}>
          <option value="not_addressed">Not Addressed</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </td>
      <td><input type="date" name="deadline" value={form.deadline} onChange={onChange} /></td>
      <td style={{ display:'flex', gap:8 }}>
        <button className="primary" onClick={async ()=>{ await save() }}>Save</button>
        <button onClick={()=>setEdit(false)}>Cancel</button>
        <button onClick={remove}>Delete</button>
      </td>
    </tr>
  )
}
