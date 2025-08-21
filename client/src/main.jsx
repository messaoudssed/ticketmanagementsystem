import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import MyTickets from './pages/MyTickets.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to='/tickets' replace />} />
          <Route path='login' element={<Login />} />
          <Route path='tickets' element={<MyTickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
