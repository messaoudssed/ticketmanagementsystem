import React,{useEffect,useState} from 'react'
import api from '../../services/api'
import TicketTable from '../../components/TicketTable'

export default function UserDashboard(){
  const [items,setItems]=useState([])
  const [status,setStatus]=useState('')
  const [q,setQ]=useState('')
  const [page,setPage]=useState(0)
  const [pageSize,setPageSize]=useState(10)
  const [rowCount,setRowCount]=useState(0)
  const [sortModel,setSortModel]=useState([{ field:'deadline', sort:'asc' }])
  const [loading,setLoading]=useState(false)
  const sortField = sortModel[0]?.field || 'deadline'
  const order = sortModel[0]?.sort || 'asc'

  const load = async (p=page, l=pageSize) => {
    setLoading(true)
    const params = new URLSearchParams({ page:String(p+1), limit:String(l), sort:sortField, order })
    if(status) params.set('status', status)
    if(q) params.set('q', q)
    const { data } = await api.get(`/tickets?${params.toString()}`)
    setItems(data.items); setRowCount(data.total); setLoading(false)
  }

  useEffect(()=>{ load(0, pageSize); setPage(0) }, [status,q,sortField,order,pageSize])

  const create = async () => {
    const title = prompt('Ticket title?'); if(!title) return
    const description = prompt('Description?') || ''
    const deadline = prompt('Deadline (YYYY-MM-DD)') || null
    await api.post('/tickets', { title, description, deadline })
    load()
  }

  const edit = async (row) => {
    const title = prompt('Title?', row.title) || row.title
    const description = prompt('Description?', row.description) || row.description
    const deadline = prompt('Deadline (YYYY-MM-DD)?', row.deadline?.slice(0,10) || '') || row.deadline
    await api.patch(`/tickets/${row._id}`, { title, description, deadline })
    load()
  }

  const del = async (row) => {
    if(!confirm('Delete ticket?')) return
    await api.delete(`/tickets/${row._id}`)
    load()
  }

  const exportCSV = async () => {
    const params = new URLSearchParams()
    if(status) params.set('status', status)
    if(q) params.set('q', q)
    params.set('sort', sortField); params.set('order', order)
    const res = await api.get(`/tickets/export?${params.toString()}`, { responseType:'blob' })
    const blob = new Blob([res.data], { type:'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my_tickets.csv'; a.click()
    URL.revokeObjectURL(a.href)
  }

  const onAction = { edit, del }

  return (
    <div>
      <h2>My Tickets</h2>
      <div className="card" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="not_addressed">Not Addressed</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="primary" onClick={()=>load()}>Apply</button>
        <div style={{flex:1}} />
        <button onClick={create}>+ Create</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>
      <TicketTable
        rows={items}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        sortModel={sortModel}
        onPageChange={(p)=>{ setPage(p); load(p,pageSize) }}
        onPageSizeChange={(s)=>{ setPageSize(s); load(0,s) }}
        onSortModelChange={(m)=>{ setSortModel(m) }}
        onAction={onAction}
      />
    </div>
  )
}
