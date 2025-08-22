import React from 'react'
export default function Home(){
  return (
    <div className="card">
      <h2>Welcome to TicketMS</h2>
      <p className="muted">Use the top navigation to access your role dashboards.</p>
      <ul>
        <li><b>User</b>: manage your own tickets</li>
        <li><b>Tech</b>: view/update all tickets and add resolution notes</li>
        <li><b>Admin</b>: full control (tickets, users, settings)</li>
      </ul>
    </div>
  )
}
