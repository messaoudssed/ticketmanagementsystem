import React,{useEffect,useState} from 'react'
import api from '../../services/api'

export default function Settings(){
  const [items,setItems]=useState([])
  const [key,setKey]=useState('')
  const [value,setValue]=useState('')

  const load = async()=>{ const {data}=await api.get('/admin/settings'); setItems(data) }
  const save = async()=>{
    if(!key) return
    let parsed
    try{ parsed = JSON.parse(value) }catch{ parsed = value }
    await api.put(`/admin/settings/${encodeURIComponent(key)}`, { value: parsed })
    setKey(''); setValue(''); load()
  }
  const remove = async(k)=>{ await api.delete(`/admin/settings/${encodeURIComponent(k)}`); load() }

  useEffect(()=>{ load() }, [])

  return (
    <div>
      <h2>Admin · Settings</h2>
      <div className="card" style={{ display:'grid', gap:8 }}>
        <input placeholder="Key (e.g. slaHours)" value={key} onChange={e=>setKey(e.target.value)} />
        <textarea rows={3} placeholder="Value (JSON or text)" value={value} onChange={e=>setValue(e.target.value)} />
        <button className="primary" onClick={save}>Save</button>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Key</th><th>Value</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(s => (
              <tr key={s._id}>
                <td>{s.key}</td>
                <td><pre style={{margin:0}}>{JSON.stringify(s.value,null,2)}</pre></td>
                <td><button onClick={()=>remove(s.key)}>Delete</button></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="3">No settings.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
