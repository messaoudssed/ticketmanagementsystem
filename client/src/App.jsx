import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userName = localStorage.getItem('userName')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <>
      <nav className="nav">
        <Link to="/tickets"><strong>🎟️ TicketMS</strong></Link>
        <div className="spacer" />
        {token ? (
          <>
            <span>Hello, {userName || 'User'}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button className="primary">Login</button></Link>
        )}
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}
