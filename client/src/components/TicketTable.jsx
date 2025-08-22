import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

export default function TicketTable({ rows=[], loading=false, page=0, pageSize=10, rowCount=0, onPageChange, onPageSizeChange, onSortModelChange, sortModel, onAction }) {
  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'priority', headerName: 'Priority', width: 110 },
    { field: 'assigneeName', headerName: 'Assignee', width: 160, valueGetter: p => p.row.assigneeName || '-' },
    { field: 'deadline', headerName: 'Deadline', width: 170, valueGetter: p => p.row.deadline ? new Date(p.row.deadline).toLocaleString() : '-' },
    { field: 'createdAt', headerName: 'Created', width: 170, valueGetter: p => p.row.createdAt ? new Date(p.row.createdAt).toLocaleString() : '-' },
    {
      field: 'actions', headerName: 'Actions', width: 200, sortable: false, renderCell: (p) => (
        <div className="actions">
          {onAction?.start && <button onClick={()=>onAction.start(p.row)}>Start</button>}
          {onAction?.close && <button onClick={()=>onAction.close(p.row)}>Close</button>}
          {onAction?.edit && <button onClick={()=>onAction.edit(p.row)}>Edit</button>}
          {onAction?.del && <button onClick={()=>onAction.del(p.row)}>Delete</button>}
        </div>
      )
    }
  ]

  const mapped = rows.map(r => ({ id: r._id || r.id, ...r }))

  return (
    <div style={{ width:'100%', background:'#0b1220', borderRadius:12, border:'1px solid #1f2937' }}>
      <DataGrid
        autoHeight
        rows={mapped}
        columns={columns}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        rowCount={rowCount}
        page={page}
        pageSizeOptions={[5,10,20,50]}
        pageSize={pageSize}
        onPaginationModelChange={(m)=>{
          if (m.page !== page && onPageChange) onPageChange(m.page)
          if (m.pageSize !== pageSize && onPageSizeChange) onPageSizeChange(m.pageSize)
        }}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        sx={{
          color:'#e5e7eb',
          border:0,
          '& .MuiDataGrid-cell':{ borderColor:'#1f2937' },
          '& .MuiDataGrid-columnHeaders':{ background:'#111827', borderColor:'#1f2937' },
          '& .MuiTablePagination-root':{ color:'#e5e7eb' }
        }}
      />
    </div>
  )
}
