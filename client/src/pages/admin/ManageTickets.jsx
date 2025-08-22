import React,{useEffect,useState} from 'react'
import api from '../../services/api'
import TicketTable from '../../components/TicketTable'

export default function ManageTickets(){
  const [items,setItems]=useState([])
  const [status,setStatus]=useState('')
  const [q,setQ]=useState('')
  const [page,setPage]=useState(0)
  const [pageSize,setPageSize]=useState(10)
  const [rowCount,setRowCount]=useState(0)
  const [sortModel,setSortModel]=useState([{ field:'createdAt', sort:'desc' }])
  const [loading,setLoading]=useState(false)
  const sortField = sortModel[0]?.field || 'createdAt'
  const order = sortModel[0]?.sort || 'desc'

  const load = async (p=page, l=pageSize) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p+1), limit: String(l), sort: sortField, order })
    if(status) params.set('status', status)
    if(q) params.set('q', q)
    const { data } = await api.get(`/admin/tickets?${params.toString()}`)
    setItems(data.items); setRowCount(data.total); setLoading(false)
  }

  useEffect(()=>{ load(0, pageSize); setPage(0) }, [status,q,sortField,order,pageSize])

  const onAction = {
    start: async (row) => { await api.patch(`/admin/tickets/${row._id}`, { status:'in_progress' }); load() },
    close: async (row) => { await api.patch(`/admin/tickets/${row._id}`, { status:'closed', resolvedBy:'Admin', resolvedAt:new Date(), resolutionNotes:'Closed by admin' }); load() },
    del: async (row) => { if(confirm('Delete ticket?')) { await api.delete(`/admin/tickets/${row._id}`); load() } }
  }

  const exportCSV = () => {
    // client-side simple export of current page
    const header = ['Title','Status','Deadline','Priority','Assignee','CreatedAt']
    const rows = items.map(t => [
      t.title || '', t.status || '', t.deadline || '', t.priority || '', t.assigneeName || '', t.createdAt || ''
    ])
    const csv = [header.join(','), ...rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'admin_tickets.csv'; a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div>
      <h2>Admin · Tickets</h2>
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
