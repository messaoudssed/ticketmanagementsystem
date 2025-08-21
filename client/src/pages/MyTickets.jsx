import React, { useEffect, useState } from 'react'
import api from '../api'
import TicketForm from '../components/TicketForm'
import TicketRow from '../components/TicketRow'

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/tickets')
      setTickets(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load tickets')
    }
  }

  const create = async (payload) => {
    try {
      await api.post('/tickets', payload)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create ticket')
    }
  }

  const save = async (id, payload) => {
    try {
      await api.patch(`/tickets/${id}`, payload)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update ticket')
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/tickets/${id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete ticket')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2>My Tickets</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <TicketForm onCreate={create} />
      <div className="card">
        <table>
          <thead>
            <tr><th align="left">Title</th><th>Status</th><th>Deadline</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tickets.length ? tickets.map(t => (
              <TicketRow key={t._id} t={t} onSave={save} onDelete={remove} />
            )) : <tr><td colSpan="4">No tickets yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
