import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminTickets() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pages, setPages] = useState(1)
  const [error, setError] = useState('')

  const load = async (p = page) => {
    try {
      const params = new URLSearchParams({ page: p, limit })
      if (status) params.set('status', status)
      if (q) params.set('q', q)
      const { data } = await api.get(`/admin/tickets?${params}`)
      setItems(data.items); setPage(data.page); setPages(data.pages)
    } catch (e) { setError(e?.response?.data?.message || 'Failed to load') }
  }

  const patch = async (id, payload) => {
    await api.patch(`/admin/tickets/${id}`, payload)
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Delete ticket?')) return
    await api.delete(`/admin/tickets/${id}`)
    await load()
  }

  useEffect(()=>{ load(1) }, [])

  return (
    <div>
      <h2>Admin · Tickets</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <div className="card" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="not_addressed">Not Addressed</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="primary" onClick={()=>load(1)}>Apply</button>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Status</th><th>Assignee</th><th>Deadline</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(t => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.status}</td>
                <td>{t.assigneeName || '-'}</td>
                <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : '-'}</td>
                <td style={{ whiteSpace:'nowrap' }}>
                  <button onClick={()=>patch(t._id, { status:'in_progress' })}>Start</button>{' '}
                  <button onClick={()=>patch(t._id, { status:'closed', resolvedBy:'Admin', resolvedAt:new Date(), resolutionNotes:'Closed by admin' })}>Close</button>{' '}
                  <button onClick={()=>remove(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="5">No tickets.</td></tr>}
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
