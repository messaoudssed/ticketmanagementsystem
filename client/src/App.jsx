import React, { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import api from './services/api'
import './styles.css'

export default function App() {
  const [me, setMe] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/auth/me')
        setMe(data)
        localStorage.setItem('role', data.role || 'user')
      } catch {
        setMe(null)
      }
    }
    load()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const role = me?.role || localStorage.getItem('role')

  return (
    <>
      <nav className="nav">
        <strong>🎫 TicketMS</strong>
        <div className="spacer" />
        <Link to="/">Home</Link>
        {role === 'admin' && <Link to="/admin/tickets">Admin · Tickets</Link>}
        {role === 'admin' && <Link to="/admin/users">Admin · Users</Link>}
        {role === 'admin' && <Link to="/admin/settings">Admin · Settings</Link>}{role === 'admin' && <Link to="/admin/analytics">Admin · Analytics</Link>}
        {(role === 'tech' || role === 'admin') && <Link to="/tech">Tech</Link>}
        <Link to="/user">My Tickets</Link>
        <div className="spacer" />
        {(localStorage.getItem('token')) ? <button onClick={logout}>Logout</button> : <Link to="/login"><button className="primary">Login</button></Link>}
      </nav>
      <div className="container">
        <Outlet context={{ me, role }} />
      </div>
    </>
  )
}
