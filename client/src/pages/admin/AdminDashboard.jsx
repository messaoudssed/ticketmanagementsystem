import React from 'react'
import { Outlet, Link } from 'react-router-dom'
export default function AdminDashboard(){
  return (
    <div>
      <div className="card actions">
        <Link to="/admin/tickets"><button className="primary">Manage Tickets</button></Link>
        <Link to="/admin/users"><button>Manage Users</button></Link>
        <Link to="/admin/settings"><button>Settings</button></Link>
      </div>
      <Outlet />
    </div>
  )
}
