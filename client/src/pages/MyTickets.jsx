import React, { useEffect, useState } from 'react'
import api from '../api'
import TicketForm from '../components/TicketForm'
import TicketRow from '../components/TicketRow'

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('deadline')
  const [order, setOrder] = useState('asc')

  const load = async () => {
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (q) params.set('q', q)
      if (sort) params.set('sort', sort)
      if (order) params.set('order', order)
      const { data } = await api.get(`/tickets?${params.toString()}`)
      setTickets(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load tickets')
    }
  }

  const create = async (payload) => {
    try { await api.post('/tickets', payload); await load() }
    catch (e) { setError(e?.response?.data?.message || 'Failed to create ticket') }
  }

  const save = async (id, payload) => {
    try { await api.patch(`/tickets/${id}`, payload); await load() }
    catch (e) { setError(e?.response?.data?.message || 'Failed to update ticket') }
  }

  const remove = async (id) => {
    try { await api.delete(`/tickets/${id}`); await load() }
    catch (e) { setError(e?.response?.data?.message || 'Failed to delete ticket') }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2>My Tickets</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}

      {/* Filters & Sort */}
      <div className="card" style={{ display:'grid', gap:10, marginBottom:12 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="not_addressed">Not Addressed</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <input placeholder="Search title or description" value={q} onChange={e=>setQ(e.target.value)} />
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created time</option>
          </select>
          <select value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button className="primary" onClick={load}>Apply</button>
        </div>
      </div>

      <TicketForm onCreate={create} />

      <div className="card">
        <table>
          <thead>
            <tr><th align="left">Title</th><th>Status</th><th>Deadline</th><th>Priority</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tickets.length ? tickets.map(t => (
              <TicketRow key={t._id} t={t} onSave={save} onDelete={remove} />
            )) : <tr><td colSpan="5">No tickets yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
