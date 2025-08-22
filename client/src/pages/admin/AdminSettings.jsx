import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminSettings() {
  const [items, setItems] = useState([])
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const load = async () => {
    const { data } = await api.get('/admin/settings')
    setItems(data)
  }
  const save = async () => {
    if (!key) return
    let parsed
    try { parsed = JSON.parse(value) } catch { parsed = value }
    await api.put(`/admin/settings/${encodeURIComponent(key)}`, { value: parsed })
    setKey(''); setValue(''); await load()
  }
  const remove = async (k) => {
    await api.delete(`/admin/settings/${encodeURIComponent(k)}`)
    await load()
  }

  useEffect(()=>{ load() }, [])

  return (
    <div>
      <h2>Admin · Settings</h2>
      <div className="card grid">
        <input placeholder="Key (e.g. slaHours)" value={key} onChange={e=>setKey(e.target.value)} />
        <textarea placeholder='Value (JSON or text)' rows={3} value={value} onChange={e=>setValue(e.target.value)} />
        <button className="primary" onClick={save}>Save</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Key</th><th>Value</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(s => (
              <tr key={s._id}>
                <td>{s.key}</td>
                <td><pre style={{ margin:0, whiteSpace:'pre-wrap' }}>{JSON.stringify(s.value, null, 2)}</pre></td>
                <td><button onClick={()=>remove(s.key)}>Delete</button></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="3">No settings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
